import { relations } from "drizzle-orm"
import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { products } from "./products"
import { productVariants } from "./productVariants"
import { productVariantImages } from "./productVariantImages"

export const board = pgTable("board", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }),
    // phone should of length 15
    phone: varchar({ length: 20 }).unique().notNull(),
    email: varchar({ length: 255 }).notNull(),
    verified: boolean().default(false).notNull(),
    ...timestamps,
})

export const boardRelations = relations(board, ({ many }) => ({
    products: many(products),
    productVariants: many(productVariants),
    productVariantImages: many(productVariantImages),
}))
