import { db, products, productVariants, productVariantImages } from "../../db"
import type { TCreateProductSchema } from "./product.schema"

/**
 * Simple slugify function
 */
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
}

export const createGlobalProduct = async (input: TCreateProductSchema) => {
    return await db.transaction(async (tx) => {
        // 1. Create Product
        const slug = `${slugify(input.name)}-${Date.now()}`
        const [newProduct] = await tx
            .insert(products)
            .values({
                name: input.name,
                brand: input.brand,
                slug: slug,
                categoryId: input.categoryId,
            })
            .returning({ id: products.id })

        if (!newProduct) {
            throw new Error("Failed to create product")
        }

        const productId = newProduct.id

        // 2. Create Variants and Images
        for (const variantInput of input.variants) {
            const [newVariant] = await tx
                .insert(productVariants)
                .values({
                    productId,
                    label: variantInput.label,
                    quantityValue: variantInput.quantityValue.toString(), // decimal in schema
                    quantityUnit: variantInput.quantityUnit,
                    sku: variantInput.sku,
                })
                .returning({ id: productVariants.id })

            if (!newVariant) {
                throw new Error("Failed to create variant")
            }

            const variantId = newVariant.id

            // 3. Create Images for the variant
            if (variantInput.images.length > 0) {
                await tx.insert(productVariantImages).values(
                    variantInput.images.map((img) => ({
                        variantId,
                        url: img.url,
                        isPrimary: img.isPrimary,
                    })),
                )
            }
        }

        return { productId }
    })
}
