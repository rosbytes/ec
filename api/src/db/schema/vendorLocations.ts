import { relations } from "drizzle-orm"
import { pgTable, uuid, integer, geometry } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { vendors } from "./vendors"

export const vendorLocations = pgTable("vendor_locations", {
    vendorId: uuid("vendor_id")
        .primaryKey()
        .references(() => vendors.id),

    // some thing wrong with geometry, should use GEOGRAPHY(Point, 4326), ac to gpt
    location: geometry({ type: "point", mode: "xy", srid: 4326 }).notNull(),
    // default serving radius in km
    radiusKm: integer("radius_km").default(4),
    ...timestamps,
})

export const vendorLocationsRelations = relations(vendorLocations, ({ one }) => ({
    vendor: one(vendors, {
        fields: [vendorLocations.vendorId],
        references: [vendors.id],
    }),
}))
