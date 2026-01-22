import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { userAddresses } from "./userAddresses"
import { orders } from "./orders"

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),

    // phone length, ideally should be 15
    phone: varchar({ length: 20 }).notNull().unique(),
    email: varchar({ length: 255 }),
    ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({
    addresses: many(userAddresses),
    orders: many(orders),
}))
