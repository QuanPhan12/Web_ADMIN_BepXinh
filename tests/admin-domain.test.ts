import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { nextVersion, reviewPatch, validateCatalog } from '../src/features/admin/domain.ts'
import type { Catalog, Recipe } from '../src/features/admin/models.ts'
import { dashboardDays } from '../src/features/admin/dashboardDomain.ts'
import { recipeLookupId } from '../src/features/admin/userReviewDomain.ts'
import { restrictionReason } from '../src/features/admin/accountRestrictions.ts'

test('Day and month chart windows use hourly/daily boundaries without gaps', () => {
  const now = new Date('2026-12-31T18:30:00Z')
  const hours = dashboardDays(now, 'day'), month = dashboardDays(now, 'month')
  assert.equal(hours.length, 24); assert.equal(month.length, 30)
  assert.equal(hours[0].start.toISOString(), '2026-12-31T17:00:00.000Z')
  assert.equal(hours[23].end.toISOString(), '2027-01-01T17:00:00.000Z')
  hours.slice(1).forEach((h, i) => assert.equal(h.start.getTime(), hours[i].end.getTime()))
  assert.equal(month[29].label, '01/01')
  assert.equal(month[29].end.getTime() - month[0].start.getTime(), 30 * 86400000)
})
test('Recipe lookup accepts copied ID, copied bullet and detail link; rejects paths', () => {
  assert.equal(recipeLookupId(' · r_test '), 'r_test')
  assert.equal(recipeLookupId('https://bepxinh-b0be7.web.app/recipe/r_test?ref=chat'), 'r_test')
  assert.throws(() => recipeLookupId('../users/admin'))
  assert.throws(() => recipeLookupId('https://example.com/users/admin'))
})
test('First violation suspension keeps a real nonempty explanation', () => {
  assert.equal(restrictionReason('suspend', '  Spam  '), '[Đình chỉ lần đầu] Spam')
  assert.equal(restrictionReason('lock', 'Spam'), 'Spam')
  assert.throws(() => restrictionReason('suspend', '  '))
  assert.throws(() => restrictionReason('lock', 'x'.repeat(471)))
})

test('Dashboard uses contiguous UTC+7 days across month/year boundaries', () => {
  const days = dashboardDays(new Date('2026-12-31T18:30:00Z'))
  assert.equal(days.length, 7)
  assert.equal(days[6].label, '01/01')
  assert.equal(days[6].start.toISOString(), '2026-12-31T17:00:00.000Z')
  assert.equal(days[6].end.toISOString(), '2027-01-01T17:00:00.000Z')
  days.slice(1).forEach((day, i) => assert.equal(day.start.getTime(), days[i].end.getTime()))
})

const catalog = () => JSON.parse(readFileSync(new URL('../../app_bep_xinh/data/catalogs/ingredients.v1.json', import.meta.url), 'utf8')) as Catalog
test('Danh mục thật hợp lệ; chặn mất ID, đơn vị và tham chiếu sai', () => {
  const original = catalog(); validateCatalog(original)
  const changed = catalog(); changed.ingredients[0].name = 'Tên cập nhật'; validateCatalog(changed, original)
  const missing = catalog(); missing.ingredients.shift(); assert.throws(() => validateCatalog(missing, original))
  const invalid = catalog(); invalid.ingredients[0].defaultUnitId = 'missing'; assert.throws(() => validateCatalog(invalid))
  const removedUnit = catalog(); removedUnit.ingredients[0].unitIds = [removedUnit.ingredients[0].defaultUnitId]; assert.throws(() => validateCatalog(removedUnit, original))
  const duplicate = catalog(); duplicate.ingredients.push({ ...duplicate.ingredients[0] }); assert.throws(() => validateCatalog(duplicate))
})
test('Phiên bản tăng cả khi đồng hồ chậm hơn phiên bản đã phát hành', () => {
  assert.equal(nextVersion('2026-11-12.v3', new Date('2026-11-12T01:00:00Z')), '2026-11-12.v4')
  assert.equal(nextVersion('2026-11-13.v3', new Date('2026-11-12T01:00:00Z')), '2026-11-13.v4')
  assert.equal(nextVersion('2026-11-11.v3', new Date('2026-11-12T01:00:00Z')), '2026-11-12.v1')
})
test('Không duyệt lại, duyệt tác giả khóa hoặc từ chối thiếu lý do', () => {
  const pending = { schemaVersion: 2, status: 'pending', authorId: 'u1' } as Recipe
  assert.deepEqual(reviewPatch(pending, 'approve', '', { id: 'u1', status: 'active' }), { status: 'approved', reviewReason: null })
  assert.throws(() => reviewPatch(pending, 'approve', '', { id: 'u1', status: 'locked' }))
  assert.throws(() => reviewPatch(pending, 'reject', '  '))
  assert.throws(() => reviewPatch({ ...pending, status: 'approved' }, 'reject', 'Lý do'))
  assert.deepEqual(reviewPatch(pending, 'reject', '  Sửa lại  '), { status: 'rejected', reviewReason: 'Sửa lại' })
})
import { userReviewDelta } from '../src/features/admin/userReviewDomain.ts'
import type { UserReview } from '../src/features/admin/models.ts'
test('User review score transitions preserve other reviews', () => {
  const review = { stars: 4, status: 'pending' } as UserReview
  assert.deepEqual(userReviewDelta(review, { sum: 5, count: 1 }, 'approve'), { status: 'approved', sum: 9, count: 2 })
  assert.deepEqual(userReviewDelta({ ...review, status: 'approved' }, { sum: 9, count: 2 }, 'hide'), { status: 'hidden', sum: 5, count: 1 })
  assert.deepEqual(userReviewDelta(review, undefined, 'hide'), { status: 'hidden', sum: 0, count: 0 })
  assert.throws(() => userReviewDelta({ ...review, status: 'approved' }, { sum: 4, count: 1 }, 'approve'))
  assert.throws(() => userReviewDelta({ ...review, status: 'approved' }, undefined, 'hide'))
})
