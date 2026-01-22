import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, geometry } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { users } from "./users"

export const userAddresses = pgTable("user_addresses", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),

    // phone length, ideally should be 15
    phone: varchar({ length: 20 }).notNull().unique(),
    label: varchar({ length: 100 }).notNull(),
    location: geometry({ type: "point", mode: "xy", srid: 4326 }).notNull(),
    address: varchar({ length: 500 }),
    ...timestamps,
})

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
    user: one(users, {
        fields: [userAddresses.userId],
        references: [users.id],
    }),
}))
