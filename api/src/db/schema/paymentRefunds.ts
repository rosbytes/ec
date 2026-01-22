import {
    uuid,
    pgTable,
    integer,
    varchar,
    decimal,
    text,
    pgEnum,
    json,
    timestamp,
} from "drizzle-orm/pg-core"
import { payments } from "./payments"
import { orders } from "./orders"
import { timestamps } from "../columnHelper"
import { relations } from "drizzle-orm"

// Refund status enum
export const refundStatusEnum = pgEnum("refund_status", [
    "pending",
    "processing",
    "completed",
    "failed",
])

// Payment refunds table
export const paymentRefunds = pgTable("payment_refunds", {
    id: uuid("id").primaryKey(),
    // References
    paymentId: uuid("payment_id")
        .notNull()
        .references(() => payments.id),
    // seems redendency
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id),
    // Refund identifiers
    refundId: varchar("refund_id", { length: 100 }).unique(), // internal refund ID
    gatewayRefundId: varchar("gateway_refund_id", { length: 100 }), // from payment gateway
    // Refund details
    refundAmount: decimal("refund_amount", {
        precision: 10,
        scale: 2,
    }).notNull(),
    refundReason: varchar("refund_reason", { length: 255 }).notNull(),
    refundType: varchar("refund_type", { length: 50 }).notNull(), // full, partial, cancellation
    // Status
    status: refundStatusEnum("status").notNull().default("pending"),
    // Refund metadata
    metadata: json("metadata"),
    // Error handling
    errorMessage: text("error_message"),
    // Timestamps
    initiatedAt: timestamp("initiated_at").notNull().defaultNow(),
    processedAt: timestamp("processed_at"),
    completedAt: timestamp("completed_at"),
    // Admin details will refer to admin table that contains users with admin responsibility
    initiatedBy: integer("initiated_by"), // uuid of admin who initiated refund
    approvedBy: integer("approved_by"), // uuid of admin who approved refund
    ...timestamps,
})

export const paymentRefundRelations = relations(paymentRefunds, ({ one }) => ({
    payment: one(payments, {
        fields: [paymentRefunds.paymentId],
        references: [payments.id],
    }),
    // seems redendency but usefull
    order: one(orders, {
        fields: [paymentRefunds.orderId],
        references: [orders.id],
    }),
}))
