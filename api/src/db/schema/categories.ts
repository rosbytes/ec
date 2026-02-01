import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { products } from "./products"
import { categoryHierarchy } from "./categoryHierarchy"

export const categories = pgTable(
    "categories",
    {
        id: uuid().primaryKey().defaultRandom(),
        name: varchar({ length: 255 }).notNull(),
        slug: varchar({ length: 255 }).notNull().unique(),

        // Mark root categories (categories with no parents)
        isRoot: boolean("is_root").default(false).notNull(),

        // Optional: Display order for sorting categories
        displayOrder: integer("display_order").default(0),

        // Optional: Icon/image for category display
        icon: varchar({ length: 500 }),

        // Optional: Description for SEO and display
        description: varchar({ length: 1000 }),

        ...timestamps,
    },
    // (t) => [
    //     // Index for slug lookups
    //     index("category_slug_idx").on(t.slug),
    //     // Index for root category queries
    //     index("category_root_idx").on(t.isRoot),
    // ],
)

export const categoriesRelations = relations(categories, ({ many }) => ({
    // Products in this category
    products: many(products),

    // Parent relationships (this category as child)
    parentCategories: many(categoryHierarchy, {
        relationName: "child_category",
    }),

    // Child relationships (this category as parent)
    childCategories: many(categoryHierarchy, {
        relationName: "parent_category",
    }),
}))
