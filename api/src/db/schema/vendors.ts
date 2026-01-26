import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { time } from "drizzle-orm/pg-core"
import { vendorLocations } from "./vendorLocations"
import { vendorVariantInventory } from "./vendorVariantInventory"
import { vendorVariantImages } from "./vendorVariantImages"
import { orders } from "./orders"
import { orderItems } from "./orderItems"

export const vendors = pgTable("vendors", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    // phone should of length 15
    phone: varchar({ length: 20 }).unique().notNull(),
    email: varchar({ length: 255 }),

    // opens_at and closes_at should be the time or other data type
    opensAt: time("opens_at").notNull(),
    closesAt: time("closes_at").notNull(),

    isActive: boolean("is_active").notNull().default(false),
    // full address of vendor
    address: varchar({ length: 500 }),
    ...timestamps,
})

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
    location: one(vendorLocations, {
        fields: [vendors.id],
        references: [vendorLocations.vendorId],
    }),
    inventory: many(vendorVariantInventory),
    orders: many(orders),
    // not so usefull
    orderedItmes: many(orderItems),
    variantImages: many(vendorVariantImages),
}))
