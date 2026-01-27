import { relations, sql } from "drizzle-orm"
import { pgTable, uuid, integer, doublePrecision, customType, point } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { vendors } from "./vendors"

// Type-safe Point interface for geographic coordinates
export interface Point {
    lat: number
    lng: number
}

const geography = customType<{ data: Point; driverData: string }>({
    dataType() {
        return "geography(point, 4326)"
    },
})

export const vendorLocations = pgTable(
    "vendor_locations",
    {
        vendorId: uuid("vendor_id")
            .primaryKey()
            .references(() => vendors.id),
        lat: doublePrecision().notNull(),
        lng: doublePrecision().notNull(),

        // some thing wrong with geometry, should use GEOGRAPHY(Point, 4326), ac to gpt
        geography: geography("geography").notNull(),
        // default serving radius in km
        radiusKm: integer("radius_km").default(4),
        ...timestamps,
    },
    (t) => [
        // PostGIS index (GiST)
        // geomIndex: index("idx_restaurants_geom").using("gist", t.geography),
    ],
)

export const vendorLocationsRelations = relations(vendorLocations, ({ one }) => ({
    vendor: one(vendors, {
        fields: [vendorLocations.vendorId],
        references: [vendors.id],
    }),
}))
