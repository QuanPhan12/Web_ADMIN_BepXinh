import { collection, doc, getDocFromServer, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, Timestamp, where } from 'firebase/firestore'
import { auth, db } from '../../config'
import { defaultAiConfig, directModels, testDirectAi, validateDirectAi } from './aiDirectApi'

export interface AiConfig { provider: 'gemini' | 'openai-compatible'; endpoint: string; model: string; enabled: boolean; dailyLimit: number; version: number; hasKey: boolean }
export interface AiModel { id: string; name: string }
const configRef = doc(db, 'ai_settings/runtime')
const publicConfig = (value: Record<string, unknown>): AiConfig => ({ provider: value.provider as AiConfig['provider'], endpoint: String(value.endpoint), model: String(value.model), enabled: value.enabled === true, dailyLimit: Number(value.dailyLimit), version: Number(value.version), hasKey: typeof value.apiKey === 'string' && !!value.apiKey })
const rawConfig = async () => (await getDocFromServer(configRef)).data() ?? { ...defaultAiConfig, apiKey: '' }
function sameSession(uid: string | undefined) { if (!uid || auth.currentUser?.uid !== uid) throw Error('Phiên đăng nhập đã thay đổi.') }
export async function loadAiConfig() { const uid = auth.currentUser?.uid; const value = await rawConfig(); sameSession(uid); return publicConfig(value) }
export async function saveAiConfig(input: Omit<AiConfig, 'hasKey'> & { apiKey: string }) {
  const uid = auth.currentUser?.uid; sameSession(uid)
  const old = await rawConfig(); sameSession(uid)
  if (input.version !== old.version) throw Error('Cấu hình đã đổi. Tải lại trước khi lưu.')
  if (!input.apiKey && (old.provider !== input.provider || old.endpoint !== input.endpoint) && old.apiKey) throw Error('Nhập key mới khi đổi nhà cung cấp hoặc API Base URL.')
  const key = input.apiKey || String(old.apiKey || '')
  const config = { ...input, hasKey: !!key }; validateDirectAi(config, key)
  if (config.enabled || input.apiKey) await testDirectAi(config, key)
  sameSession(uid)
  await runTransaction(db, async tx => {
    const current = (await tx.get(configRef)).data() ?? defaultAiConfig
    sameSession(uid)
    if (current.version !== input.version) throw Error('Cấu hình đã đổi trong lúc kiểm tra. Tải lại trước khi lưu.')
    tx.set(configRef, { provider: input.provider, endpoint: input.endpoint.replace(/\/+$/, ''), model: input.model, enabled: input.enabled, dailyLimit: input.dailyLimit, apiKey: key, version: input.version + 1, updatedBy: uid, updatedAt: serverTimestamp() })
  })
  sameSession(uid); return publicConfig({ ...config, apiKey: key, version: input.version + 1 })
}
export async function loadAiModels(apiKey: string) { const uid = auth.currentUser?.uid; sameSession(uid); const current = await rawConfig(); sameSession(uid); const key = apiKey || (current.provider === 'gemini' ? String(current.apiKey || '') : ''); if (!key) throw Error('Nhập Gemini API key trước.'); const models = await directModels(key); sameSession(uid); return { models } }
export interface AiStatsRow { date: string; requests: number; users: number; completed: number; failed: number; processing: number; interrupted: number; attempts: number }
export interface AiStats { asOf: number; timezone: string; daily: AiStatsRow[]; totals: Omit<AiStatsRow, 'date'> & { completionRate: number | null }; truncated: boolean; settings: { enabled: boolean; provider: string; model: string } }
export async function loadAiStats(): Promise<AiStats> {
  const uid = auth.currentUser?.uid; sameSession(uid)
  const now = Date.now(), startToday = Math.floor((now + 25200000) / 86400000) * 86400000 - 25200000
  const daily = Array.from({ length: 7 }, (_, i) => ({ date: new Date(startToday - (6 - i) * 86400000 + 25200000).toISOString().slice(0, 10), requests: 0, users: 0, completed: 0, failed: 0, processing: 0, interrupted: 0, attempts: 0 }))
  const [records, config, oldQuotas] = await Promise.all([getDocs(query(collection(db, 'ai_chat_events'), where('expiresAt', '>=', Timestamp.fromMillis(startToday - 6 * 86400000 + 7 * 86400000)), orderBy('expiresAt'), limit(3501))), loadAiConfig(), Promise.all(daily.map(day => getDocFromServer(doc(db, `_ai_limits/project_${day.date}`))))])
  sameSession(uid)
  const users = new Set<string>(), byDay = new Map(daily.map(day => [day.date, new Set<string>()]))
  for (const record of records.docs.slice(0, 3500)) {
    const value = record.data(), date = new Date(value.attemptedAtMillis + 25200000).toISOString().slice(0, 10), day = daily.find(d => d.date === date)
    if (!day) continue
    day.requests++; day.attempts += Number(value.attempts || 0); users.add(value.uid); byDay.get(date)!.add(value.uid)
    if (value.status === 'done') day.completed++; else if (value.status === 'failed') day.failed++; else if (value.leaseUntil > now) day.processing++; else day.interrupted++
  }
  daily.forEach((day, i) => { day.users = byDay.get(day.date)!.size; day.attempts += Number(oldQuotas[i].data()?.count || 0) })
  const totals = { requests: 0, users: users.size, completed: 0, failed: 0, processing: 0, interrupted: 0, attempts: 0, completionRate: null as number | null }
  for (const day of daily) for (const key of ['requests', 'completed', 'failed', 'processing', 'interrupted', 'attempts'] as const) totals[key] += day[key]
  const finished = totals.completed + totals.failed + totals.interrupted
  totals.completionRate = finished ? Math.round(totals.completed / finished * 1000) / 10 : null
  return { asOf: now, timezone: 'UTC+7', daily, totals, truncated: records.size > 3500, settings: { enabled: config.enabled, provider: config.provider, model: config.model } }
}
