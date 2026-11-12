export type Role = 'user' | 'moderator' | 'admin'
export type RecipeStatus = 'pending' | 'approved' | 'rejected'
export interface DateValue { toDate(): Date }
export interface Account {
  id: string; name: string; handle: string; bio: string; role?: Role
  status?: 'active' | 'locked'; lockReason?: string | null; cookedCount: number
  createdAt?: DateValue; updatedAt?: DateValue
}
export interface RemoteImage { id: string; name: string; url: string; publicId: string }
export interface RecipeIngredient {
  id: string; ingredientId: string | null; name: string; amount: number | null
  unitId: string | null; toTaste: boolean; note: string; groupId: string
}
export interface RecipeContent {
  title: string; description: string; cover: RemoteImage; preparationMinutes: number
  cookingMinutes: number; servings: number; difficulty: 'easy' | 'medium' | 'hard'
  meals: string[]; categories: string[]; storageNotes: string
  ingredientGroups: { id: string; name: string }[]; ingredients: RecipeIngredient[]
  steps: { id: string; title: string; instruction: string; minutes: number | null; tip: string; photo?: RemoteImage | null }[]
}
export interface Recipe {
  id: string; schemaVersion: number; authorId: string
  author: { id: string; name: string; handle: string }
  content: RecipeContent; contentHash: string; catalogVersion: string
  status: RecipeStatus; isBanner: boolean; submittedAt?: DateValue
  reviewedAt?: DateValue; reviewedBy?: string | null; reviewReason?: string | null; revisionOf?: string | null
}
export interface Category { id: string; name: string; sortOrder: number }
export interface Unit { id: string; label: string; type: 'mass' | 'volume' | 'count' | 'kitchen' }
export interface Ingredient {
  id: string; name: string; categoryId: string; aliases: string[]; unitIds: string[]; defaultUnitId: string
}
export interface Catalog {
  schemaVersion: 1; version: string; locale: 'vi-VN'; categories: Category[]
  units: Unit[]; ingredients: Ingredient[]; contentHash: string; updatedAt?: DateValue
}
export interface ReviewEvent {
  id: string; submissionId: string; authorId: string; decision: 'approve' | 'reject'
  reviewer: string; reason: string | null; createdAt?: DateValue
}
