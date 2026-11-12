import type { Category } from "./categories.model";
import type { Ingredient } from "./ingredients.model";
import type { Unit } from "./units.model";

export interface Catalog {
    categories: Category[];
    contentHash: string;
    ingredients: Ingredient[];
    locale: string;
    schemaVersion: string;
    units: Unit[];
    updatedAt: Date;
    version: string;
}