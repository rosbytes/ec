import { relations } from "drizzle-orm"
import { pgTable, uuid, decimal, primaryKey, integer } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { vendors } from "./vendors"
import { productVariants } from "./productVariants"

export const vendorVariantInventory = pgTable(
    "vendor_variant_inventory",
    {
        vendorId: uuid("vendor_id")
            .notNull()
            .references(() => vendors.id),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id),
        // Pricing
        price: decimal("price", { precision: 10, scale: 2 }).notNull(),
        mrp: decimal("mrp", { precision: 10, scale: 2 }),
        // Stock quantity (how many units you have in inventory)
        stockQuantity: integer("stock_quantity").notNull().default(0),
        // isAvailable: boolean("is_available").notNull().default(false),
        ...timestamps,
    },
    (t) => [primaryKey({ columns: [t.vendorId, t.variantId] })],
)

export const vendorVariantInventoryRelations = relations(vendorVariantInventory, ({ one }) => ({
    vendor: one(vendors, {
        fields: [vendorVariantInventory.vendorId],
        references: [vendors.id],
    }),
    variant: one(productVariants, {
        fields: [vendorVariantInventory.variantId],
        references: [productVariants.id],
    }),
}))
