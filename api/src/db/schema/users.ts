import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { userAddresses } from "./userAddresses"
import { orders } from "./orders"

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    // first name and last name, last could be null
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }),

    // phone length, ideally should be 15
    phone: varchar({ length: 20 }).notNull().unique(),
    email: varchar({ length: 255 }),
    verified: boolean().default(false).notNull(),
    ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({
    addresses: many(userAddresses),
    orders: many(orders),
}))
