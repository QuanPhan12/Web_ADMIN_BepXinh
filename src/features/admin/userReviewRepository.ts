import { collection, doc, getDoc, limit, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore'
import { auth, db } from '../../config'
import type { RatingSummary, Recipe, UserReview, UserReviewStatus } from './models'
import { recipeLookupId, userReviewDelta } from './userReviewDomain'

export const userReviewsQuery = (recipeId: string, status: UserReviewStatus, size: number) => query(collection(db, 'recipes', recipeId, 'user_reviews'), where('status', '==', status), orderBy('updatedAt', 'desc'), limit(size))
export const reviewReportsQuery = (recipeId: string, uid: string, size: number) => query(collection(db, 'recipes', recipeId, 'user_reviews', uid, 'reports'), orderBy('updatedAt', 'desc'), limit(size))
export async function findReviewRecipe(id: string) {
  const snap = await getDoc(doc(db, 'recipes', recipeLookupId(id)))
  if (!snap.exists()) throw new Error('Không tìm thấy món. Chọn Xem đánh giá trong danh sách bên dưới.')
  return { ...snap.data(), id: snap.id } as Recipe
}
export async function moderateUserReview(recipeId: string, expected: UserReview, decision: 'approve' | 'hide') {
  if (!auth.currentUser) throw new Error('Phiên đăng nhập đã kết thúc.')
  await runTransaction(db, async tx => {
    const recipeRef = doc(db, 'recipes', recipeId), reviewRef = doc(recipeRef, 'user_reviews', expected.id), ratingRef = doc(recipeRef, 'ratings', 'summary')
    const [recipe, review, rating] = await Promise.all([tx.get(recipeRef), tx.get(reviewRef), tx.get(ratingRef)])
    if (!recipe.exists() || recipe.data().status !== 'approved' || !review.exists()) throw new Error('Công thức hoặc đánh giá không còn khả dụng.')
    const current = review.data() as UserReview
    // So sánh cả nano giây để không duyệt nhầm nội dung tác giả vừa sửa trong lúc đang xem.
    if (current.uid !== expected.id || current.status !== expected.status || current.updatedAt.seconds !== expected.updatedAt.seconds || current.updatedAt.nanoseconds !== expected.updatedAt.nanoseconds) throw new Error('Đánh giá đã thay đổi. Hãy xem lại nội dung mới trước khi duyệt.')
    if (recipe.data().authorId === current.uid) throw new Error('Không xử lý đánh giá của chính tác giả công thức.')
    const { status, sum, count } = userReviewDelta(current, rating.exists() ? rating.data() as RatingSummary : undefined, decision)
    tx.update(reviewRef, { status, updatedAt: serverTimestamp() })
    tx.set(ratingRef, { sum, count, lastReviewerId: expected.id, updatedAt: serverTimestamp() })
  })
}
