import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, foreignKey } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { products } from "./products"

export const categories = pgTable(
    "categories",
    {
        id: uuid().primaryKey().defaultRandom(),
        name: varchar({ length: 255 }).notNull(),
        // What does this means? => parent_id (self fk)
        parentId: uuid("parent_id"),
        ...timestamps,
    },
    (t) => [
        foreignKey({ columns: [t.parentId], foreignColumns: [t.parentId] }),
    ],
)

export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products),
}))
