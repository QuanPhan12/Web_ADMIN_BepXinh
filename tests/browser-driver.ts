import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, authReady, db } from '../src/config'
import { getMetrics, reviewRecipe, saveCatalog, setBanner, updateAccount, watchList, recipeQuery } from '../src/features/admin/repository'
import type { Account, Catalog, Recipe } from '../src/features/admin/models'

export async function run(input: { email: string; password: string; recipeId: string; authorId: string }) {
  if (import.meta.env.VITE_USE_EMULATORS !== 'true') throw new Error('Emulator build required')
  let checks = 0
  const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); checks++ }
  await authReady; await signInWithEmailAndPassword(auth, input.email, input.password)
  const counts = await getMetrics(true); check(counts.pending > 0 && counts.users! >= 2, 'Metrics')
  await reviewRecipe(input.recipeId, 'approve', '')
  const recipe = (await getDoc(doc(db, 'recipes', input.recipeId))).data() as Recipe
  check(recipe.status === 'approved' && !!recipe.reviewedAt, 'Approval')
  check((await getDoc(doc(db, 'recipe_moderation_events', input.recipeId))).data()?.reviewer === auth.currentUser?.uid, 'Audit')
  let duplicate = false
  try { await reviewRecipe(input.recipeId, 'reject', 'Duplicate') } catch { duplicate = true }
  check(duplicate, 'Review replay blocked')
  await setBanner(input.recipeId, false, true)
  const sawBanner = await new Promise<boolean>((resolve, reject) => {
    let stop = () => {}
    const timer = setTimeout(() => { stop(); reject(new Error('Listener timeout')) }, 10000)
    stop = watchList<Recipe>(recipeQuery('approved', 50, true), rows => { clearTimeout(timer); stop(); resolve(rows.some(r => r.id === input.recipeId && r.isBanner)) }, reject)
  })
  check(sawBanner, 'Realtime banner listener')
  const original = (await getDoc(doc(db, 'catalogs', 'ingredients'))).data() as Catalog
  const changed = structuredClone({ ...original, updatedAt: undefined }) as Catalog
  changed.ingredients[0].aliases.push('Alias smoke test')
  await saveCatalog(changed, original)
  const saved = (await getDoc(doc(db, 'catalogs', 'ingredients'))).data() as Catalog
  check(saved.version !== original.version && saved.contentHash !== original.contentHash && saved.ingredients[0].aliases.includes('Alias smoke test'), 'Publish catalog')
  let stale = false
  try { await saveCatalog(changed, original) } catch { stale = true }
  check(stale, 'Stale catalog blocked')
  const account = (await getDoc(doc(db, 'users', input.authorId))).data() as Account
  await updateAccount(account, 'user', 'locked', 'Smoke test')
  const locked = (await getDoc(doc(db, 'users', input.authorId))).data() as Account
  check(locked.status === 'locked' && locked.lockReason === 'Smoke test', 'Lock account')
  await updateAccount(locked, 'user', 'active', '')
  check((await getDoc(doc(db, 'users', input.authorId))).data()?.status === 'active', 'Unlock account')
  return { checks }
}
