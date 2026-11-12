import type { Category } from '../models/catalogs/categories.model'

export const categoriesFixture: Category[] = [
  { id: 'family-meals', name: 'Ẩm thực Cơm gia đình', sortOrder: 1 },
  { id: 'eat-clean', name: 'Thực dưỡng & Eat Clean', sortOrder: 2 },
  { id: 'hotpot-party', name: 'Lẩu & Tiệc Cuối Tuần', sortOrder: 3 },
  { id: 'traditional-rolls', name: 'Món cuốn & Bánh truyền thống', sortOrder: 4 },
  { id: 'snacks-drinks', name: 'Ăn vặt & Giải khát', sortOrder: 5 },
]
