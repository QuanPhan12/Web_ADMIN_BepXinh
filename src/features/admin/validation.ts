import type { Catalog, RecipeContent, RemoteImage } from './models'
const check = (v: unknown, message = 'Nội dung bài không hợp lệ; cần yêu cầu tác giả gửi bản sửa.'): void => { if (!v) throw new Error(message) }
const text = (s: string, max: number, required = false) => check(typeof s === 'string' && s.length <= max && (!required || s.trim().length > 0))
const integer = (n: number, min: number, max: number) => check(Number.isInteger(n) && n >= min && n <= max)
const unique = (values: unknown[]) => check(new Set(values).size === values.length)
const exact = (value: object, keys: string[]) => check(value && JSON.stringify(Object.keys(value).sort()) === JSON.stringify(keys.sort()))
function image(i: RemoteImage) {
  exact(i, ['id', 'name', 'url', 'publicId']); text(i.id, 128, true); text(i.name, 255); text(i.publicId, 500, true)
  const u = new URL(i.url)
  check(u.protocol === 'https:' && u.hostname === 'res.cloudinary.com' && u.pathname.startsWith('/ddqouziau/image/upload/') && !u.username && !u.password && !u.search && !u.hash && i.url.length <= 2048)
}
export function validateRecipe(c: RecipeContent, catalog: Catalog) {
  exact(c, [...(Object.hasOwn(c, 'isBanner') ? ['isBanner'] : []), 'title', 'description', 'cover', 'preparationMinutes', 'cookingMinutes', 'servings', 'difficulty', 'meals', 'categories', 'storageNotes', 'ingredientGroups', 'ingredients', 'steps'])
  text(c.title, 80, true); text(c.description, 500); text(c.storageNotes, 500); image(c.cover)
  integer(c.preparationMinutes, 0, 240); integer(c.cookingMinutes, 1, 720); integer(c.servings, 1, 50)
  check(['easy', 'medium', 'hard'].includes(c.difficulty))
  for (const [values, allowed] of [[c.meals, ['breakfast', 'lunch', 'dinner', 'snack', 'gathering', 'weekend']], [c.categories, ['eat_clean', 'quick', 'soup', 'vegetarian']]]) {
    check(Array.isArray(values)); unique(values); check(values.every(v => allowed.includes(v)))
  }
  check(Array.isArray(c.ingredientGroups) && c.ingredientGroups.length >= 1 && c.ingredientGroups.length <= 8)
  unique(c.ingredientGroups.map(g => g.id))
  for (const g of c.ingredientGroups) { exact(g, ['id', 'name']); text(g.id, 128, true); text(g.name, 60, true) }
  check(Array.isArray(c.ingredients) && c.ingredients.length >= 1 && c.ingredients.length <= 30)
  unique(c.ingredients.map(i => i.id)); unique(c.ingredients.map(i => i.ingredientId || `custom:${i.name.toLowerCase().trim()}`))
  const units = new Set(catalog.units.map(u => u.id)), ingredients = new Map(catalog.ingredients.map(i => [i.id, i]))
  for (const i of c.ingredients) {
    exact(i, ['id', 'ingredientId', 'name', 'amount', 'unitId', 'note', 'toTaste', 'groupId'])
    text(i.id, 128, true); text(i.name, 80, true); text(i.note, 160)
    check(typeof i.toTaste === 'boolean' && c.ingredientGroups.some(g => g.id === i.groupId))
    if (i.ingredientId !== null) check(ingredients.has(i.ingredientId))
    if (i.toTaste) check(i.amount === null && i.unitId === null)
    else {
      check(typeof i.amount === 'number' && Number.isFinite(i.amount) && i.amount > 0 && i.amount <= 100000 && units.has(i.unitId!))
      if (i.ingredientId !== null) check(ingredients.get(i.ingredientId)?.unitIds.includes(i.unitId!))
    }
  }
  check(Array.isArray(c.steps) && c.steps.length >= 1 && c.steps.length <= 20); unique(c.steps.map(s => s.id))
  for (const s of c.steps) {
    exact(s, ['id', 'title', 'instruction', 'minutes', 'tip', 'photo']); text(s.id, 128, true); text(s.title, 80); text(s.instruction, 2000, true); text(s.tip, 500)
    if (s.minutes !== null) integer(s.minutes, 1, 720)
    if (s.photo !== null) image(s.photo!)
  }
  check(new TextEncoder().encode(JSON.stringify(c)).length <= 400000)
}
