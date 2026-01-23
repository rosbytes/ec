import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, index } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { categories } from "./categories"
import { productVariants } from "./productVariants"

export const products = pgTable("products", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    brand: varchar({ length: 255 }).notNull(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id),
    ...timestamps,
})

export const productsRelations = relations(products, ({ one, many }) => ({
    // this might create problems later
    categories: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    variants: many(productVariants),
}))
