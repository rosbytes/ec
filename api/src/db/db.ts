import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "../configs/env.config"
import * as userSchema from "./schema/users"
import * as userAddressesSchema from "./schema/userAddresses"
import * as vendorsSchema from "./schema/vendors"
import * as vendorLocationsSchema from "./schema/vendorLocations"
import * as categoriesSchema from "./schema/categories"
import * as productsSchema from "./schema/products"
import * as productVariantsSchema from "./schema/productVariants"
import * as productVariantImagesSchema from "./schema/productVariantImages"
import * as vendorVariantImagesSchema from "./schema/vendorVariantImages"
import * as vendorVariantInventorySchema from "./schema/vendorVariantInventory"
import * as ordersSchema from "./schema/orders"
import * as orderItemsSchema from "./schema/orderItems"
import * as paymentsSchema from "./schema/payments"
import * as paymentRefundsSchema from "./schema/paymentRefunds"

const client = postgres(env.DATABASE_URL)
client`SELECT 1`.then(() => console.log("DB connected")).catch(console.error)
export const db = drizzle(client, {
    schema: {
        ...userSchema,
        ...userAddressesSchema,
        ...vendorsSchema,
        ...vendorLocationsSchema,
        ...categoriesSchema,
        ...productsSchema,
        ...productVariantsSchema,
        ...productVariantImagesSchema,
        ...vendorVariantImagesSchema,
        ...vendorVariantInventorySchema,
        ...ordersSchema,
        ...orderItemsSchema,
        ...paymentsSchema,
        ...paymentRefundsSchema,
    },
    casing: "snake_case",
})
