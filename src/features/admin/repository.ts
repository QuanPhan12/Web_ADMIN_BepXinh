import { collection, doc, getCountFromServer, getDoc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore'
import type { Query, DocumentData } from 'firebase/firestore'
import { auth, db } from '../../config'
import type { Account, Catalog, Recipe, RecipeStatus, ReviewEvent, Role } from './models'
import { catalogPayload, nextVersion, reviewPatch, validateCatalog } from './domain'
import { validateRecipe } from './validation'
import { dashboardDays } from './dashboardDomain'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import type { DashboardPeriod } from './dashboardDomain'

export function watchList<T>(q: Query<DocumentData>, onData: (rows: T[]) => void, onError: (e: unknown) => void) {
  return onSnapshot(q, snap => onData(snap.docs.map(d => ({ ...d.data(), id: d.id }) as T)), onError)
}
export const recipeQuery = (status: RecipeStatus, size: number, banners = false) => query(collection(db, 'recipes'), where('status', '==', status), ...(banners ? [where('isBanner', '==', true)] : []), orderBy('submittedAt', 'desc'), limit(size))
export const usersQuery = (size: number) => query(collection(db, 'users'), orderBy('__name__'), limit(size))
export const auditQuery = (size: number) => query(collection(db, 'recipe_moderation_events'), orderBy('createdAt', 'desc'), limit(size))
export function watchCatalog(onData: (c: Catalog | null) => void, onError: (e: unknown) => void) {
  return onSnapshot(doc(db, 'catalogs', 'ingredients'), s => onData(s.exists() ? s.data() as Catalog : null), onError)
}
function reviewer() {
  if (!auth.currentUser) throw new Error('Phiên đăng nhập đã kết thúc.')
  return auth.currentUser.uid
}
export async function reviewRecipe(id: string, decision: 'approve' | 'reject', reason: string) {
  const uid = reviewer(), ref = doc(db, 'recipes', id), event = doc(db, 'recipe_moderation_events', id)
  await runTransaction(db, async tx => {
    const [s, e] = await Promise.all([tx.get(ref), tx.get(event)])
    if (!s.exists() || e.exists()) throw new Error('Bài đã được xử lý hoặc không còn tồn tại.')
    const recipe = { ...s.data(), id: s.id } as Recipe
    const author = await tx.get(doc(db, 'users', recipe.authorId))
    const patch = reviewPatch(recipe, decision, reason, author.exists() ? author.data() as Account : undefined)
    if (decision === 'approve') {
      const catalog = await tx.get(doc(db, 'catalogs', 'ingredients'))
      if (!catalog.exists()) throw new Error('Chưa có danh mục nguyên liệu để kiểm tra bài.')
      validateRecipe(recipe.content, catalog.data() as Catalog)
    }
    tx.update(ref, { ...patch, reviewedAt: serverTimestamp(), reviewedBy: uid })
    tx.set(event, { submissionId: id, authorId: recipe.authorId, decision, reviewer: uid, reason: patch.reviewReason, createdAt: serverTimestamp() })
  })
}
export async function setBanner(id: string, expected: boolean, enabled: boolean) {
  reviewer()
  await runTransaction(db, async tx => {
    const ref = doc(db, 'recipes', id), snap = await tx.get(ref)
    if (!snap.exists() || snap.data().status !== 'approved') throw new Error('Chỉ chọn banner cho bài đã duyệt.')
    if ((snap.data().isBanner ?? false) !== expected) throw new Error('Banner đã được người khác cập nhật. Hãy kiểm tra lại.')
    tx.update(ref, { isBanner: enabled })
  })
}
export async function saveCatalog(draft: Catalog, expected: Catalog) {
  reviewer()
  validateCatalog(draft, expected)
  const payload = catalogPayload({ ...draft, version: nextVersion(expected.version) })
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload))))).map(x => x.toString(16).padStart(2, '0')).join('')
  await runTransaction(db, async tx => {
    const ref = doc(db, 'catalogs', 'ingredients'), snap = await tx.get(ref)
    if (!snap.exists() || snap.data().version !== expected.version || snap.data().contentHash !== expected.contentHash) throw new Error('Danh mục đã thay đổi. Tải phiên bản mới trước khi lưu.')
    tx.set(ref, { ...payload, contentHash: hash, updatedAt: serverTimestamp() })
  })
}
export async function updateAccount(expected: Account, role: Role, status: 'active' | 'locked', reason: string) {
  const uid = reviewer()
  if (uid === expected.id) throw new Error('Không thể tự thay đổi quyền hoặc khóa tài khoản đang đăng nhập.')
  if (status === 'locked' && (!reason.trim() || reason.trim().length > 500)) throw new Error('Nhập lý do khóa từ 1 đến 500 ký tự.')
  await runTransaction(db, async tx => {
    const ref = doc(db, 'users', expected.id), snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Tài khoản không còn tồn tại.')
    const current = snap.data()
    if ((current.role ?? 'user') !== (expected.role ?? 'user') || (current.status ?? 'active') !== (expected.status ?? 'active')) throw new Error('Quyền tài khoản đã thay đổi. Hãy kiểm tra lại.')
    tx.update(ref, { role, status, lockReason: status === 'locked' ? reason.trim() : null, lockedAt: status === 'locked' ? serverTimestamp() : null, updatedAt: serverTimestamp() })
  })
}
export async function getMetrics(isAdmin: boolean, period: DashboardPeriod = 'week') {
  const count = async (q: Query<DocumentData>) => (await getCountFromServer(q)).data().count
  const days = dashboardDays(new Date(), period)
  const [statuses, banners, users, daily] = await Promise.all([
    Promise.all((['pending', 'approved', 'rejected', 'hidden', 'deleted'] as const).map(s => count(query(collection(db, 'recipes'), where('status', '==', s))))),
    count(query(collection(db, 'recipes'), where('status', '==', 'approved'), where('isBanner', '==', true))),
    isAdmin ? count(query(collection(db, 'users'))) : Promise.resolve(null),
    Promise.all(days.map(async day => ({ label: day.label, count: await count(query(collection(db, 'recipes'), where('submittedAt', '>=', day.start), where('submittedAt', '<', day.end))) }))),
  ])
  const [pending, approved, rejected, hidden, deleted] = statuses
  return { pending, approved, rejected, hidden, deleted, banners, users, daily, period }
}

export async function resolveAuditNames(events: ReviewEvent[]) {
  const recipes = [...new Set(events.map(e => e.submissionId))]
  const people = [...new Set(events.flatMap(e => [e.reviewer, e.authorId]).filter(Boolean))]
  const [recipeDocs, userDocs] = await Promise.all([
    Promise.all(recipes.map(id => getDoc(doc(db, 'recipes', id)))),
    Promise.all(people.map(id => getDoc(doc(db, 'users', id)))),
  ])
  const recipeMap = new Map(recipeDocs.map(d => [d.id, d.data()])), userMap = new Map(userDocs.map(d => [d.id, d.data()]))
  return Object.fromEntries(events.map(e => [e.id, {
    title: recipeMap.get(e.submissionId)?.content?.title || 'Món không còn khả dụng',
    author: userMap.get(e.authorId)?.name || recipeMap.get(e.submissionId)?.author?.name || 'Tài khoản không còn khả dụng',
    reviewer: userMap.get(e.reviewer)?.name || 'Tài khoản không còn khả dụng',
  }]))
}

export async function saveAdminProfile(id: string, name: string, bio: string) {
  if (reviewer() !== id || !name.trim() || name.trim().length > 60 || bio.trim().length > 200) throw new Error('Kiểm tra tên hiển thị và giới thiệu.')
  await runTransaction(db, async tx => {
    const ref = doc(db, 'users', id), snap = await tx.get(ref)
    if (!snap.exists() || snap.data().status !== 'active') throw new Error('Tài khoản không còn khả dụng.')
    tx.update(ref, { name: name.trim(), bio: bio.trim(), updatedAt: serverTimestamp() })
  })
}

export async function changeAdminPassword(id: string, current: string, password: string, confirm: string) {
  const user = auth.currentUser
  if (!user || user.uid !== id || !user.email || !user.providerData.some(p => p.providerId === 'password')) throw new Error('Phiên đăng nhập không hỗ trợ đổi mật khẩu.')
  if (!current || password.length < 6 || password.length > 128 || password === current) throw new Error('Chọn mật khẩu mới từ 6 đến 128 ký tự, khác mật khẩu hiện tại.')
  if (password !== confirm) throw new Error('Mật khẩu xác nhận không khớp.')
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current))
  if (auth.currentUser?.uid !== id) throw new Error('Phiên đăng nhập đã thay đổi.')
  await updatePassword(user, password)
}
export const getOwnProfile = async () => auth.currentUser ? getDoc(doc(db, 'users', auth.currentUser.uid)) : null
export type { Recipe, ReviewEvent }
