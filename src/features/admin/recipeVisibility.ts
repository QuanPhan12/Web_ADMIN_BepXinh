import { collection, doc, limit, orderBy, query, runTransaction, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../config'
import type { Recipe } from './models'

export const visibilityEventsQuery = (id: string, size: number) => query(collection(db, 'recipes', id, 'visibility_events'), orderBy('createdAt', 'desc'), limit(size))
export async function setRecipeVisibility(expected: Recipe, hidden: boolean, reason: string) {
  const actor = auth.currentUser?.uid
  if (!actor) throw new Error('Phiên đăng nhập đã kết thúc.')
  const trimmed = reason.trim()
  if (hidden && (!trimmed || trimmed.length > 500)) throw new Error('Nhập lý do ẩn từ 1 đến 500 ký tự.')
  const ref = doc(db, 'recipes', expected.id), event = doc(collection(ref, 'visibility_events'))
  await runTransaction(db, async tx => {
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Bài không còn tồn tại.')
    const current = snap.data() as Recipe
    if (current.status !== expected.status || current.visibilityEventId !== expected.visibilityEventId) throw new Error('Trạng thái bài đã thay đổi. Hãy xem lại trước khi xử lý.')
    if (hidden ? !(current.status === 'approved' || (current.status === 'hidden' && current.visibilityRole === 'author')) : !(current.status === 'hidden' && current.visibilityRole === 'admin')) throw new Error('Chỉ hiện lại bài do admin ẩn; không hiện lại bài tác giả đã ẩn hoặc xóa.')
    const status = hidden ? 'hidden' : 'approved', note = hidden ? trimmed : null
    tx.update(ref, { status, isBanner: false, visibilityEventId: event.id, visibilityActor: actor, visibilityRole: 'admin', visibilityReason: note, visibilityAt: serverTimestamp() })
    tx.set(event, { actor, role: 'admin', reason: note, fromStatus: current.status, toStatus: status, createdAt: serverTimestamp() })
  })
}
