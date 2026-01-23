import { pgTable, uuid, decimal, varchar, integer, index } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { orders } from "./orders"
import { productVariants } from "./productVariants"
import { vendors } from "./vendors"
import { relations } from "drizzle-orm"

export const orderItems = pgTable(
    "order_items",
    {
        id: uuid().primaryKey().defaultRandom(),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id),
        // vendorId is necessary for partial fulfillment
        vendorId: uuid("vendor_id")
            .notNull()
            .references(() => vendors.id),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id),
        // Product details (snapshot at time of order - important for historical data)
        productName: varchar("product_name", { length: 255 }).notNull(),
        productImage: varchar("product_image", { length: 500 }),
        // Quantity ordered
        quantity: integer("quantity").notNull(), // how many units customer ordered
        // Pricing (snapshot at time of order)
        unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(), // price that charges per unit
        // For partial fulfillment you need refund and fulfillment details as well here
        ...timestamps,
    },
    // (t) => [
    //     index("order_item_order_idx").on(t.orderId),
    //     index("order_item_vendor_idx").on(t.vendorId),
    //     index("order_item_variant_idx").on(t.variantId),
    // ],
)

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    vendor: one(vendors, {
        fields: [orderItems.vendorId],
        references: [vendors.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}))
