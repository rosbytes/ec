import { relations } from "drizzle-orm"
import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { vendors } from "./vendors"
import { productVariants } from "./productVariants"

export const vendorVariantImages = pgTable("vendor_variant_images", {
    id: uuid().primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
        .notNull()
        .references(() => vendors.id),
    variantId: uuid("variant_id")
        .notNull()
        .references(() => productVariants.id),
    url: varchar({ length: 500 }).notNull(),
    isPrimary: boolean("is_primary").default(false),
    ...timestamps,
})

export const vendorVariantImagesRelations = relations(
    vendorVariantImages,
    ({ one }) => ({
        vendor: one(vendors, {
            fields: [vendorVariantImages.vendorId],
            references: [vendors.id],
        }),
        variant: one(productVariants, {
            fields: [vendorVariantImages.variantId],
            references: [productVariants.id],
        }),
    }),
)
