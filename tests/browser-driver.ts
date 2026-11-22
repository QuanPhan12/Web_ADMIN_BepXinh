import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, getDocs } from 'firebase/firestore'
import { auth, authReady, db } from '../src/config'
import { getMetrics, reviewRecipe, saveCatalog, setBanner, updateAccount, watchList, recipeQuery } from '../src/features/admin/repository'
import type { Account, Catalog, Recipe } from '../src/features/admin/models'
import type { UserReview } from '../src/features/admin/models'
import { moderateUserReview } from '../src/features/admin/userReviewRepository'
import { setRecipeVisibility, visibilityEventsQuery } from '../src/features/admin/recipeVisibility'
import { resolveRecipeReport } from '../src/features/admin/recipeReports'
import type { RecipeReport } from '../src/features/admin/recipeReports'

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
  const reviewRef = doc(db, 'recipes', input.recipeId, 'user_reviews', 'reader'), ratingRef = doc(db, 'recipes', input.recipeId, 'ratings', 'summary')
  const readReview = async () => ({ ...(await getDoc(reviewRef)).data(), id: 'reader' }) as UserReview
  const pendingReview = await readReview()
  await moderateUserReview(input.recipeId, pendingReview, 'approve')
  check((await getDoc(ratingRef)).data()?.sum === 4 && (await getDoc(ratingRef)).data()?.count === 1, 'Review approval adds score atomically')
  let staleReview = false
  try { await moderateUserReview(input.recipeId, pendingReview, 'hide') } catch { staleReview = true }
  check(staleReview, 'Stale review blocked')
  await moderateUserReview(input.recipeId, await readReview(), 'hide')
  check((await getDoc(ratingRef)).data()?.sum === 0 && (await getDoc(ratingRef)).data()?.count === 0, 'Hide removes approved score')
  await moderateUserReview(input.recipeId, await readReview(), 'approve')
  check((await readReview()).status === 'approved' && (await getDoc(ratingRef)).data()?.count === 1, 'Hidden review can be approved again')
  const beforeHide = { ...(await getDoc(doc(db, 'recipes', input.recipeId))).data(), id: input.recipeId } as Recipe
  await setRecipeVisibility(beforeHide, true, 'SDK hide test')
  const hidden = { ...(await getDoc(doc(db, 'recipes', input.recipeId))).data(), id: input.recipeId } as Recipe
  check(hidden.status === 'hidden' && hidden.isBanner === false && hidden.visibilityRole === 'admin', 'Admin hide clears banner')
  let staleVisibility = false
  try { await setRecipeVisibility(beforeHide, false, '') } catch { staleVisibility = true }
  check(staleVisibility, 'Stale visibility action blocked')
  await setRecipeVisibility(hidden, false, '')
  check((await getDoc(doc(db, 'recipes', input.recipeId))).data()?.status === 'approved', 'Admin restore')
  check((await getDocs(visibilityEventsQuery(input.recipeId, 50))).size === 2, 'Visibility audit is atomic')
  const reportRef = doc(db, 'recipe_reports', `reader:${input.recipeId}`)
  const reported = { ...(await getDoc(reportRef)).data(), id: reportRef.id } as RecipeReport
  await resolveRecipeReport(reported, true, 'SDK report resolution')
  check((await getDoc(reportRef)).data()?.resolution === 'hidden', 'Report resolved with hidden outcome')
  const reportedHidden = { ...(await getDoc(doc(db, 'recipes', input.recipeId))).data(), id: input.recipeId } as Recipe
  check(reportedHidden.status === 'hidden' && !reportedHidden.isBanner, 'Report resolution hides recipe atomically')
  let duplicateReport = false
  try { await resolveRecipeReport(reported, false, 'Duplicate') } catch { duplicateReport = true }
  check(duplicateReport, 'Report replay blocked')
  await setRecipeVisibility(reportedHidden, false, '')
  const dismissRef = doc(db, 'recipe_reports', `dismiss:${input.recipeId}`)
  await resolveRecipeReport({ ...(await getDoc(dismissRef)).data(), id: dismissRef.id } as RecipeReport, false, 'No violation found')
  check((await getDoc(dismissRef)).data()?.status === 'dismissed' && (await getDoc(doc(db, 'recipes', input.recipeId))).data()?.status === 'approved', 'Dismiss leaves recipe published')
  await setBanner(input.recipeId, false, true)
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
