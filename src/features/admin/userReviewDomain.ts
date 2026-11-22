import type { RatingSummary, UserReview } from './models.ts'

export const userReviewLabels = { pending: 'Chờ duyệt', approved: 'Đã duyệt', hidden: 'Đã ẩn' }

export function recipeLookupId(value: string) {
  let id = value.trim().replace(/^Mã món:\s*/i, '').replace(/^[·•`\s]+/, '').replace(/[`\s]+$/, '')
  if (/^https?:\/\//.test(id)) {
    const url = new URL(id), match = url.pathname.match(/^\/recipe\/([^/]+)\/?$/)
    if (!match) throw new Error('Dán liên kết chi tiết món hoặc mã món dưới tên công thức.')
    id = decodeURIComponent(match[1])
  }
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) throw new Error('Mã món không hợp lệ. Chọn Xem đánh giá ở danh sách bên dưới.')
  return id
}
export function userReviewDelta(review: UserReview, aggregate: RatingSummary | undefined, decision: 'approve' | 'hide') {
  if (!['pending', 'approved', 'hidden'].includes(review.status) || !Number.isInteger(review.stars) || review.stars < 1 || review.stars > 5) throw new Error('Đánh giá không hợp lệ.')
  const status = decision === 'approve' ? 'approved' : 'hidden'
  if (review.status === status) throw new Error('Đánh giá đã được xử lý. Hãy tải lại danh sách.')
  const old = review.status === 'approved' ? review.stars : 0, next = status === 'approved' ? review.stars : 0
  const sum = (aggregate?.sum ?? 0) + next - old, count = (aggregate?.count ?? 0) + (next ? 1 : 0) - (old ? 1 : 0)
  if (!Number.isInteger(sum) || !Number.isInteger(count) || count < 0 || sum < count || sum > count * 5) throw new Error('Điểm tổng hiện tại không hợp lệ. Không thể duyệt đánh giá.')
  return { status, sum, count }
}
