import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, pgEnum } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"

export const roles = pgEnum("roles", ["consumer", "vendor", "admin"])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 255 }).unique().notNull(),
    role: roles().default("consumer"),
    ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({}))
