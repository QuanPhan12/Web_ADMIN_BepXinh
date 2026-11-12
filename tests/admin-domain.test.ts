import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { nextVersion, reviewPatch, validateCatalog } from '../src/features/admin/domain.ts'
import type { Catalog, Recipe } from '../src/features/admin/models.ts'

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
