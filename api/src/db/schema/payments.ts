import {
    pgTable,
    uuid,
    decimal,
    pgEnum,
    text,
    timestamp,
    varchar,
    json,
    integer,
} from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { orders } from "./orders"
import { relations } from "drizzle-orm"

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "processing",
    "completed",
    "failed",
    "refunded",
    "partially_refunded",
    "cancelled",
])

// Payment method enum
export const paymentMethodEnum = pgEnum("payment_method", [
    "cash_on_delivery",
    "upi",
    "credit_card",
    "debit_card",
    "wallet",
    "net_banking",
    "emi",
])

// Payment provider enum
export const paymentProviderEnum = pgEnum("payment_provider", [
    "razorpay",
    "paytm",
    "phonepe",
    "gpay",
    "stripe",
    "cashfree",
    "cod", // cash on delivery
])

export const payments = pgTable(
    "payments",
    {
        id: uuid().primaryKey().defaultRandom(),
        // reference to the order
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id),

        // Payment identifiers
        internalPaymentId: varchar("payment_id", { length: 100 }).unique(), // internal payment ID
        transactionId: varchar("transaction_id", { length: 100 }), // from payment gateway
        gatewayOrderId: varchar("gateway_order_id", { length: 100 }), // order ID from payment gateway

        // Payment details
        paymentMethod: paymentMethodEnum("payment_method").notNull(),
        paymentProvider: paymentProviderEnum("payment_provider").notNull(),

        // Amount details
        amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
        currency: varchar("currency", { length: 3 }).notNull().default("INR"),

        // Gateway fees (optional - for tracking)
        gatewayFee: decimal("gateway_fee", { precision: 10, scale: 2 }),
        gst: decimal("gst", { precision: 10, scale: 2 }),
        netAmount: decimal("net_amount", { precision: 10, scale: 2 }), // amount - gatewayFee - gst

        // Status
        status: paymentStatusEnum("status").notNull().default("pending"),

        // Payment metadata (store gateway response)
        metadata: json("metadata"), // JSON field for gateway-specific data

        // Error handling
        errorCode: varchar("error_code", { length: 50 }),
        errorMessage: text("error_message"),
        failureReason: text("failure_reason"),

        // Payment timestamps
        initiatedAt: timestamp("initiated_at").notNull().defaultNow(),
        completedAt: timestamp("completed_at"),
        failedAt: timestamp("failed_at"),

        // Retry tracking
        retryCount: integer("retry_count").notNull().default(0),
        lastRetryAt: timestamp("last_retry_at"),

        // Additional details
        payerName: varchar("payer_name", { length: 255 }),
        payerEmail: varchar("payer_email", { length: 255 }),
        payerPhone: varchar("payer_phone", { length: 20 }),

        // Card details (last 4 digits only, for reference)
        cardLast4: varchar("card_last_4", { length: 4 }),
        cardNetwork: varchar("card_network", { length: 50 }), // Visa, Mastercard, etc.

        // UPI details
        upiId: varchar("upi_id", { length: 100 }),

        // Wallet details
        walletProvider: varchar("wallet_provider", { length: 50 }), // Paytm, PhonePe, etc.

        // IP and device info (for fraud detection)
        ipAddress: varchar("ip_address", { length: 45 }),
        userAgent: text("user_agent"),

        ...timestamps,
    },
    // (t) => [index("payment_order_idx").on(t.orderId)],
)

export const paymentRelations = relations(payments, ({ one }) => ({
    order: one(orders, {
        fields: [payments.orderId],
        references: [orders.id],
    }),
}))
