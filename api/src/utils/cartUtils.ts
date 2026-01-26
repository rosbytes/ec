import type { TCartItem } from "../modules/user/cart.schema"

export const getCartKey = (userId: string) => `user:cart:${userId}`

/**
 * Helpers for the optimized field pattern: "vendorId:productId:variantId"
 */
export const constructField = (item: { vendorId: string; productId: string; variantId: string }) =>
    `${item.vendorId}:${item.productId}:${item.variantId}`

export const parseField = (field: string, quantity: string): TCartItem => {
    const [vendorId, productId, variantId] = field.split(":")
    return {
        vendorId: vendorId,
        productId: productId,
        variantId: variantId,
        quantity: parseInt(quantity, 10),
    }
}
