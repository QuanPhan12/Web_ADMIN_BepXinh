import type { Category } from "../models/catalogs/categories.model";
import { categoriesFixture } from "../fixtures/categories.fixture";

export const catalogsRepository = {
    getAll: async (): Promise<Category[]> =>
        categoriesFixture.map((category) => ({ ...category })),
}