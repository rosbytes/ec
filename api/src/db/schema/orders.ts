import {
    pgTable,
    uuid,
    decimal,
    pgEnum,
    boolean,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { vendors } from "./vendors"
import { payments } from "./payments"
import { relations } from "drizzle-orm"
import { orderItems } from "./orderItems"
import { timestamps } from "../columnHelper"

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "confirmed",
    "processing",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "refunded",
])

export const orders = pgTable("orders", {
    id: uuid().primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(), // e.g., "ORD-2024-001234"
    // reference to user and vendor
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    vendorId: uuid("vendor_id")
        .notNull()
        .references(() => vendors.id),
    paymentId: uuid("payment_id").notNull(),
    status: orderStatusEnum().notNull().default("pending"),
    // Order amounts
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(), // sum of all items
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 })
        .notNull()
        .default("0"),
    tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    // Coupon/Promo
    couponCode: varchar("coupon_code", { length: 50 }),
    // Cancellation
    isCancelled: boolean("is_cancelled").notNull().default(false),
    cancellationReason: text("cancellation_reason"),
    cancelledAt: timestamp("cancelled_at"),
    ...timestamps,
})

export const orderRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    vendor: one(vendors, {
        fields: [orders.vendorId],
        references: [vendors.id],
    }),
    payment: one(payments, {
        fields: [orders.paymentId],
        references: [payments.id],
    }),
    orderItems: many(orderItems),
}))

// model Order {
//   id                String        @id @default(cuid())
//   userId            String
//   orderNumber       String        @unique

//   status            OrderStatus   @default(PENDING_PAYMENT)
//   itemsTotal        Int
//   totalAmount       Int
//   deliveryCharge    Int
//   shippingAddress   Json?

//   slot              String?
//   expectedDelivery  DateTime?

//   paymentProvider   String?
//   paymentOrderId    String?
//   paymentRef        String?
//   paymentMethod     String?

//   deliveredAt       DateTime?
//   cancelledAt       DateTime?

//   createdAt         DateTime      @default(now())
//   updatedAt         DateTime      @updatedAt

//   items             OrderItem[]

//   @@index([userId])
// }

// model OrderItem{
//   id          String   @id @default(cuid())
//   orderId     String
//   productId   String
//   variantId   String
//   name        String
//   localName   String
//   image       String?
//   label       String
//   price       Int
//   quantity    Int
//   order       Order   @relation(fields: [orderId],references: [id])

// }
// enum OrderStatus{
//   PENDING
//   PENDING_PAYMENT
//   PAID
//   CANCELLED
//   SHIPPED
//   DELIVERED
//   ARRIVING
// }
