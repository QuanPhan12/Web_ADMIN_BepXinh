import type { AiConfig, AiModel } from './aiRepository'

export const defaultAiConfig: AiConfig = { provider: 'gemini', endpoint: 'https://generativelanguage.googleapis.com', model: 'gemini-3.5-flash-lite', enabled: false, dailyLimit: 40, version: 0, hasKey: false }
export function validateDirectAi(value: AiConfig, key: string) {
  if (!['gemini', 'openai-compatible'].includes(value.provider) || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(value.model) || !Number.isInteger(value.dailyLimit) || value.dailyLimit < 1 || value.dailyLimit > 100 || !Number.isInteger(value.version) || value.version < 0 || typeof value.enabled !== 'boolean') throw Error('Kiểm tra model và giới hạn 1–100 lượt/ngày.')
  const url = new URL(value.endpoint)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw Error('API Base URL phải dùng HTTPS và không chứa thông tin đăng nhập.')
  if (value.provider === 'gemini' && value.endpoint !== defaultAiConfig.endpoint) throw Error('Địa chỉ Gemini không hợp lệ.')
  if (key && (key.length < 12 || key.length > 512 || /\s/.test(key))) throw Error('API key không đúng định dạng.')
  if (value.enabled && !key) throw Error('Nhập API key trước khi bật AI.')
}
async function providerJson(url: string, key: string, gemini: boolean, body?: unknown) {
  let response: Response
  try { response = await fetch(url, { method: body ? 'POST' : 'GET', headers: { ...(gemini ? { 'x-goog-api-key': key } : { Authorization: `Bearer ${key}` }), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(40000) }) } catch { throw Error('Không gọi được API trực tiếp. Kiểm tra mạng và CORS của nhà cung cấp.') }
  if (!response.ok) throw Error(response.status === 404 ? 'Model này không dùng được với key (HTTP 404). Chọn model mới hơn từ danh sách.' : response.status === 429 ? 'API đã giới hạn lượt dùng hoặc hết quota (HTTP 429).' : `API từ chối yêu cầu (HTTP ${response.status}). Kiểm tra key, model và quyền sử dụng.`)
  return response.json()
}
export async function directModels(key: string): Promise<AiModel[]> {
  const models = new Map<string, AiModel>(); let pageToken = ''
  for (let page = 0; page < 10; page++) {
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models'); url.searchParams.set('pageSize', '100'); if (pageToken) url.searchParams.set('pageToken', pageToken)
    const result = await providerJson(url.toString(), key, true)
    if (!Array.isArray(result.models)) throw Error('Danh sách model không hợp lệ.')
    for (const model of result.models) {
      const id = typeof model.name === 'string' ? model.name.replace(/^models\//, '') : ''
      if (/^gemini-[a-zA-Z0-9._-]{1,90}$/.test(id) && !/(image|audio|tts|live|robotics|computer-use)/i.test(id) && model.supportedGenerationMethods?.includes('generateContent')) models.set(id, { id, name: /^gemini-2\.5-/.test(id) ? `${id} · Có giới hạn với project mới` : id })
    }
    pageToken = typeof result.nextPageToken === 'string' ? result.nextPageToken : ''; if (!pageToken) break
  }
  return [...models.values()].sort((a, b) => (a.id === 'gemini-3.5-flash-lite' ? -1 : b.id === 'gemini-3.5-flash-lite' ? 1 : a.id.localeCompare(b.id)))
}
export async function testDirectAi(config: AiConfig, key: string) {
  const prompt = 'Trả JSON duy nhất: {"reply":"Kết nối thành công","recipeIds":[]}.'
  let raw: unknown
  if (config.provider === 'gemini') {
    const result = await providerJson(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`, key, true, { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 2048, responseMimeType: 'application/json' } })
    raw = result.candidates?.[0]?.content?.parts?.filter((part: { thought?: boolean }) => !part.thought).map((part: { text?: string }) => part.text ?? '').join('')
  } else {
    const result = await providerJson(`${config.endpoint.replace(/\/+$/, '')}/chat/completions`, key, false, { model: config.model, messages: [{ role: 'user', content: prompt }], ...(new URL(config.endpoint).hostname === 'api.openai.com' ? { max_completion_tokens: 2048 } : { max_tokens: 2048 }), response_format: { type: 'json_object' } })
    raw = result.choices?.[0]?.message?.content
  }
  if (typeof raw !== 'string' || raw.includes(key)) throw Error('API chưa trả nội dung phù hợp.')
  try { const answer = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); if (typeof answer.reply !== 'string' || !answer.reply.trim() || !Array.isArray(answer.recipeIds)) throw Error() } catch { throw Error('Model chưa trả được JSON hội thoại. Hãy chọn model khác.') }
}
