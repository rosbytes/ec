import { uuid, pgTable, pgEnum, varchar, decimal } from "drizzle-orm/pg-core"
import { products } from "./products"
import { timestamps } from "../columnHelper"
import { relations } from "drizzle-orm"
import { productVariantImages } from "./productVariantImages"
import { vendorVariantImages } from "./vendorVariantImages"
import { vendorVariantInventory } from "./vendorVariantInventory"
import { orderItems } from "./orderItems"

export const quantityUnitEnum = pgEnum("quantity_unit", [
    // Weight units
    "mg",
    "g",
    "kg",

    // Volume units
    "ml",
    "l",

    // Count/Piece units
    "pc",
    "pack",
    "box",
    "dozen",
    "pair",
    "bag",
    "bundle",

    // Container units
    "bottle",
    "can",
    "jar",
    "carton",
    "tub",
    "pouch",
    "sachet",

    // Length/Area units
    "m",
    "sq_m",

    // Other units
    "tablet",
])

export const productVariants = pgTable("product_variants", {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id),
    // variants can have different name or labels as well
    label: varchar({ length: 100 }).notNull(), // e.g. 500g, 1L
    // Display quantity (what customer sees: "500 g", "1 l", "6 pc")
    quantityValue: decimal("quantity_value", {
        precision: 10,
        scale: 2,
    }).notNull(),
    quantityUnit: quantityUnitEnum("quantity_unit").notNull(),
    // Pricing already available in vendor inventory
    // price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    // mrp: decimal("mrp", { precision: 10, scale: 2 }),
    sku: varchar({ length: 100 }).unique(),
    // can add primary variant if need like isPrimary
    ...timestamps,
})

export const productVariantsRelations = relations(
    productVariants,
    ({ one, many }) => ({
        // this might create problems later
        product: one(products, {
            fields: [productVariants.productId],
            references: [products.id],
        }),
        officalImages: many(productVariantImages),
        imagesByVendors: many(vendorVariantImages),
        inventoryOfVendors: many(vendorVariantInventory),
        // not so usefull
        orderedItems: many(orderItems),
    }),
)
