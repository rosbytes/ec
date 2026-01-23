import { pgTable, uuid, varchar, boolean, index } from "drizzle-orm/pg-core"
import { timestamps } from "../columnHelper"
import { productVariants } from "./productVariants"
import { relations } from "drizzle-orm"

export const productVariantImages = pgTable(
    "product_variant_images",
    {
        id: uuid().primaryKey().defaultRandom(),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id),
        url: varchar({ length: 500 }).notNull(),
        isPrimary: boolean("is_primary").notNull().default(false),
        ...timestamps,
    },
    // (t) => [index("product_variant_image_variant_idx").on(t.variantId)],
)

export const productVariantImagesRelations = relations(productVariantImages, ({ one }) => ({
    // this might create problems later
    variant: one(productVariants, {
        fields: [productVariantImages.variantId],
        references: [productVariants.id],
    }),
}))
