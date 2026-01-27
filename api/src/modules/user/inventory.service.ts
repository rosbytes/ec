import { sql, eq, and, gt } from "drizzle-orm"
import {
    db,
    distance,
    makePoint,
    orderByNearest,
    products,
    productVariantImages,
    productVariants,
    roundMeters,
    vendorLocations,
    vendors,
    vendorVariantImages,
    vendorVariantInventory,
    withinRadius,
} from "../../db"

export async function nearestActiveVendorInRadius(
    latitude: number,
    longitude: number,
    // change this according to delivery range
    radiusMeters: number = 5000,
) {
    // TODO: Implement actual spatial query using ST_DWithin or similar
    // For now, returning all locations to fix type errors
    const userPoint = makePoint({
        lat: latitude,
        lng: longitude,
    })
    const distanceMeters = roundMeters(
        distance({
            from: sql`${vendorLocations.geography}`,
            to: userPoint,
        }),
    )
    const [firstActiveVendor] = await db
        .select({
            id: vendorLocations.vendorId,
            distanceMeters,
        })
        .from(vendorLocations)
        .innerJoin(vendors, eq(vendorLocations.vendorId, vendors.id))
        .where(
            and(
                withinRadius({
                    from: sql`${vendorLocations.geography}`,
                    to: userPoint,
                    radiusMeters,
                }),
                eq(vendors.isActive, true),
            ),
        )
        .orderBy(
            orderByNearest({
                from: sql`${vendorLocations.geography}`,
                to: userPoint,
            }),
        )
        .limit(1)
    return firstActiveVendor
}

export async function vendorInventory({ vendorId }: { vendorId: string }) {
    // Get all inventory items with variant and product details
    const inventoryItems = await db
        .select({
            // Product info
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            productBrand: products.brand,
            // Variant info
            variantId: productVariants.id,
            variantLabel: productVariants.label,
            variantSku: productVariants.sku,
            quantityValue: productVariants.quantityValue,
            quantityUnit: productVariants.quantityUnit,
            // Inventory info
            stockQuantity: vendorVariantInventory.stockQuantity,
            price: vendorVariantInventory.price,
            mrp: vendorVariantInventory.mrp,
        })
        .from(vendorVariantInventory)
        .innerJoin(productVariants, eq(vendorVariantInventory.variantId, productVariants.id))
        .innerJoin(products, eq(productVariants.productId, products.id))
        .where(
            and(
                eq(vendorVariantInventory.vendorId, vendorId),
                gt(vendorVariantInventory.stockQuantity, 0),
            ),
        )
        .orderBy(products.name, productVariants.label)

    if (inventoryItems.length === 0) {
        return []
    }

    // Get all variant IDs
    const variantIds = inventoryItems.map((item) => item.variantId)

    // Fetch vendor images for these variants
    const vendorImages = await db
        .select({
            variantId: vendorVariantImages.variantId,
            imageId: vendorVariantImages.id,
            url: vendorVariantImages.url,
            isPrimary: vendorVariantImages.isPrimary,
        })
        .from(vendorVariantImages)
        .where(
            and(
                eq(vendorVariantImages.vendorId, vendorId),
                sql`${vendorVariantImages.variantId} = ANY(${variantIds})`,
            ),
        )
        .orderBy(vendorVariantImages.isPrimary, vendorVariantImages.createdAt)

    // Fetch product images for these variants (as fallback)
    const productImages = await db
        .select({
            variantId: productVariantImages.variantId,
            imageId: productVariantImages.id,
            url: productVariantImages.url,
            isPrimary: productVariantImages.isPrimary,
        })
        .from(productVariantImages)
        .where(sql`${productVariantImages.variantId} = ANY(${variantIds})`)
        .orderBy(productVariantImages.isPrimary, productVariantImages.createdAt)

    // Group images by variantId
    const imagesByVariant = new Map<
        string,
        Array<{ id: string; url: string; isPrimary: boolean; source: "vendor" | "product" }>
    >()

    // Add vendor images first (higher priority)
    for (const img of vendorImages) {
        if (!imagesByVariant.has(img.variantId)) {
            imagesByVariant.set(img.variantId, [])
        }
        imagesByVariant.get(img.variantId)!.push({
            id: img.imageId,
            url: img.url,
            isPrimary: img.isPrimary ?? false,
            source: "vendor",
        })
    }

    // Add product images as fallback (only if no vendor images exist)
    for (const img of productImages) {
        if (!imagesByVariant.has(img.variantId)) {
            imagesByVariant.set(img.variantId, [])
        }
        // Only add product images if there are no vendor images for this variant
        const variantImages = imagesByVariant.get(img.variantId)!
        if (variantImages.length === 0 || variantImages[0].source === "product") {
            variantImages.push({
                id: img.imageId,
                url: img.url,
                isPrimary: img.isPrimary ?? false,
                source: "product",
            })
        }
    }

    // Group by product
    const productMap = new Map<
        string,
        {
            id: string
            name: string
            slug: string
            brand: string
            variants: Array<{
                id: string
                label: string
                sku: string | null
                quantityValue: string
                quantityUnit: string
                stockQuantity: number
                price: string
                mrp: string | null
                images: Array<{
                    id: string
                    url: string
                    isPrimary: boolean
                    source: "vendor" | "product"
                }>
            }>
        }
    >()

    for (const item of inventoryItems) {
        if (!productMap.has(item.productId)) {
            productMap.set(item.productId, {
                id: item.productId,
                name: item.productName,
                slug: item.productSlug,
                brand: item.productBrand,
                variants: [],
            })
        }

        productMap.get(item.productId)!.variants.push({
            id: item.variantId,
            label: item.variantLabel,
            sku: item.variantSku,
            quantityValue: item.quantityValue,
            quantityUnit: item.quantityUnit,
            stockQuantity: item.stockQuantity,
            price: item.price,
            mrp: item.mrp,
            images: imagesByVariant.get(item.variantId) || [],
        })
    }

    return Array.from(productMap.values())
}
