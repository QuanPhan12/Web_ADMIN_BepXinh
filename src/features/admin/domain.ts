import type { Catalog, DateValue, Recipe, RecipeStatus } from './models.ts'

export const statusLabels: Record<RecipeStatus, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' }
export const searchKey = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().trim()
export const formatDate = (value?: DateValue | null) => value?.toDate ? value.toDate().toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' }) : '—'
function ensure(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message) }
function validText(s: string, max = 120) { return typeof s === 'string' && s.trim() === s && s.length > 0 && s.length <= max && s.normalize('NFC') === s }
function uniqueIds(items: { id: string }[]) {
  ensure(items.length > 0 && new Set(items.map(x => x.id)).size === items.length, 'Danh sách trống hoặc trùng ID.')
  ensure(items.every(x => /^[a-z][a-z0-9_]*$/.test(x.id)), 'ID chỉ gồm chữ thường, số và dấu gạch dưới; bắt đầu bằng chữ.')
}
export function catalogPayload(c: Catalog) {
  return { schemaVersion: c.schemaVersion, version: c.version, locale: c.locale, categories: c.categories, units: c.units, ingredients: c.ingredients }
}
export function validateCatalog(c: Catalog, previous?: Catalog) {
  ensure(c.schemaVersion === 1 && c.locale === 'vi-VN', 'Schema danh mục không được hỗ trợ.')
  ensure(/^\d{4}-\d{2}-\d{2}\.v\d+$/.test(c.version), 'Phiên bản phải có dạng YYYY-MM-DD.vN.')
  uniqueIds(c.categories); uniqueIds(c.units); uniqueIds(c.ingredients)
  ensure(new Set(c.categories.map(x => x.sortOrder)).size === c.categories.length, 'Thứ tự nhóm bị trùng.')
  ensure(c.categories.every(x => validText(x.name) && Number.isInteger(x.sortOrder) && x.sortOrder >= 0), 'Tên hoặc thứ tự nhóm không hợp lệ.')
  ensure(c.units.every(x => validText(x.label) && ['mass', 'volume', 'count', 'kitchen'].includes(x.type)), 'Đơn vị không hợp lệ.')
  const categories = new Set(c.categories.map(x => x.id)), units = new Set(c.units.map(x => x.id))
  ensure(new Set(c.ingredients.map(x => x.name.toLocaleLowerCase('vi'))).size === c.ingredients.length, 'Tên nguyên liệu bị trùng.')
  for (const i of c.ingredients) {
    ensure(validText(i.name) && categories.has(i.categoryId), `Tên hoặc nhóm không hợp lệ: ${i.id}.`)
    ensure(Array.isArray(i.aliases) && i.aliases.every(x => validText(x)) && new Set(i.aliases.map(searchKey)).size === i.aliases.length, `Tên gọi khác không hợp lệ: ${i.id}.`)
    ensure(i.unitIds.length > 0 && new Set(i.unitIds).size === i.unitIds.length && i.unitIds.every(x => units.has(x)) && i.unitIds.includes(i.defaultUnitId), `Đơn vị không hợp lệ: ${i.id}.`)
  }
  // Giữ ID và đơn vị đã phát hành vì công thức và tủ lạnh đang tham chiếu chúng.
  if (previous) {
    for (const old of previous.ingredients) {
      const next = c.ingredients.find(x => x.id === old.id)
      ensure(next && old.unitIds.every(x => next.unitIds.includes(x)), `Không được xóa nguyên liệu/đơn vị đã phát hành: ${old.id}.`)
    }
    ensure(previous.categories.every(x => categories.has(x.id)) && previous.units.every(x => units.has(x.id)), 'Không được xóa ID nhóm/đơn vị đã phát hành.')
  }
  ensure(new TextEncoder().encode(JSON.stringify(catalogPayload(c))).length < 750000, 'Danh mục vượt giới hạn 750 KB.')
}
export function nextVersion(version: string, date = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  const [day, revision] = version.split('.v')
  return `${day && day >= today ? day : today}.v${day && day >= today ? Number(revision) + 1 : 1}`
}
export function reviewPatch(recipe: Recipe, decision: 'approve' | 'reject', reason: string, author?: { id: string; status?: string }) {
  ensure(recipe.schemaVersion === 2 && recipe.status === 'pending', 'Bài đã được xử lý hoặc schema không hợp lệ. Hãy tải lại danh sách.')
  const trimmed = reason.trim()
  ensure(trimmed.length <= 500 && (decision !== 'reject' || trimmed.length > 0), 'Nhập lý do từ chối từ 1 đến 500 ký tự.')
  if (decision === 'approve') ensure(author?.id === recipe.authorId && (author.status ?? 'active') === 'active', 'Tác giả không tồn tại hoặc đang bị khóa.')
  return { status: decision === 'approve' ? 'approved' as const : 'rejected' as const, reviewReason: trimmed || null }
}
export function errorMessage(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : ''
  if (code.includes('permission-denied')) return 'Không có quyền thực hiện. Kiểm tra role/status tài khoản và Firestore Rules đã triển khai.'
  if (code.startsWith('auth/')) return 'Không đăng nhập được. Kiểm tra email, mật khẩu và quyền truy cập tài khoản.'
  if (code.includes('unavailable') || code.includes('network')) return 'Không kết nối được Firebase. Kiểm tra mạng rồi thử lại.'
  return error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
}
