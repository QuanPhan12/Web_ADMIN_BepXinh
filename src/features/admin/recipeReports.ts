import { collection, doc, getDoc, limit, query, runTransaction, serverTimestamp, where } from 'firebase/firestore'
import { auth, db } from '../../config'
import type { DateValue, Recipe } from './models'

export type ReportStatus = 'open' | 'resolved' | 'dismissed'
export interface RecipeReport {
  id: string; recipeId: string; recipeTitle: string; reporterId: string; category: string; reason: string
  status: ReportStatus; createdAt?: DateValue; resolution?: string; resolutionReason?: string; resolvedBy?: string; resolvedAt?: DateValue
}
export const reportCategories: Record<string, string> = { unsafe: 'Hướng dẫn nấu không an toàn', copyright: 'Vi phạm bản quyền', spam: 'Spam hoặc quảng cáo', inappropriate: 'Nội dung không phù hợp', other: 'Lý do khác' }
export const reportStatusLabels = { open: 'Chờ xử lý', resolved: 'Đã xử lý', dismissed: 'Không vi phạm' }
export const recipeReportsQuery = (status: ReportStatus, size: number) => query(collection(db, 'recipe_reports'), where('status', '==', status), limit(size))
export async function getReportedRecipe(id: string) {
  const snap = await getDoc(doc(db, 'recipes', id))
  if (!snap.exists()) throw new Error('Công thức không còn tồn tại.')
  return { ...snap.data(), id: snap.id } as Recipe
}
export async function resolveRecipeReport(expected: RecipeReport, hide: boolean, reason: string) {
  const actor = auth.currentUser?.uid, note = reason.trim()
  if (!actor) throw new Error('Phiên đăng nhập đã kết thúc.')
  if (!note || note.length > 500) throw new Error('Nhập kết quả xem xét từ 1 đến 500 ký tự.')
  const reportRef = doc(db, 'recipe_reports', expected.id)
  await runTransaction(db, async tx => {
    const report = await tx.get(reportRef)
    if (!report.exists() || report.data().status !== 'open' || report.data().recipeId !== expected.recipeId) throw new Error('Báo cáo đã được xử lý hoặc thay đổi. Hãy tải lại.')
    let resolution = 'dismissed'
    if (hide) {
      const ref = doc(db, 'recipes', expected.recipeId), post = await tx.get(ref)
      if (!post.exists()) throw new Error('Công thức không còn tồn tại. Hãy xem lại báo cáo.')
      const recipe = post.data() as Recipe
      if (recipe.status === 'approved' || (recipe.status === 'hidden' && recipe.visibilityRole === 'author')) {
        const event = doc(collection(ref, 'visibility_events'))
        tx.update(ref, { status: 'hidden', isBanner: false, visibilityEventId: event.id, visibilityActor: actor, visibilityRole: 'admin', visibilityReason: note, visibilityAt: serverTimestamp() })
        tx.set(event, { actor, role: 'admin', reason: note, fromStatus: recipe.status, toStatus: 'hidden', createdAt: serverTimestamp() })
        resolution = 'hidden'
      } else if (recipe.status === 'hidden' || recipe.status === 'deleted') resolution = 'unavailable'
      else throw new Error('Công thức không ở trạng thái có thể xử lý báo cáo.')
    }
    tx.update(reportRef, { status: hide ? 'resolved' : 'dismissed', resolution, resolutionReason: note, resolvedBy: actor, resolvedAt: serverTimestamp() })
  })
}
