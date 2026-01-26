import type { UserContext } from "../../middlewares"
import { TRPCError } from "@trpc/server"
import type { TAddToCartSchema, TRemoveFromCartSchema, TDeleteFromCartSchema } from "./cart.schema"
import { cache, logger } from "../../configs"
import { getCartKey, parseField, constructField } from "../../utils"

/*
 * get user cart from cache with all items
 */
export async function getCart({ ctx }: { ctx: UserContext }) {
    try {
        const cartData = await cache.hGetAll(getCartKey(ctx.user.id))
        const items = Object.entries(cartData).map(([field, qty]) => parseField(field, qty))
        return { success: true, items }
    } catch (error) {
        logger.error(error)
        throw new TRPCError({ message: "Failed to fetch cart", code: "INTERNAL_SERVER_ERROR" })
    }
}

/*
 * add item to user cart with one quantity
 */
export async function addToCart({ input, ctx }: { input: TAddToCartSchema; ctx: UserContext }) {
    try {
        const key = getCartKey(ctx.user.id)

        // Input is guaranteed to be an array of at least 1 item (as per schema and user clarification).
        // Since user specified only one product will be received at a time:
        const item = input[0]
        const field = constructField(item)

        // 1. Enforce single-vendor lock across existing cart
        const existingFields = await cache.hKeys(key)
        if (existingFields.length > 0) {
            const currentVendorId = existingFields[0].split(":")[0]
            if (currentVendorId !== item.vendorId) {
                throw new TRPCError({
                    message:
                        "Cart contains items from another vendor. Clear cart first to shop from this vendor.",
                    code: "CONFLICT",
                })
            }
        }

        // 2. Save using HINCRBY for atomicity
        await cache.hIncrBy(key, field, 1)

        return { success: true, message: "Cart updated" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to update cart", code: "INTERNAL_SERVER_ERROR" })
    }
}

/*
 * delete item from user cart with all quantity
 */
export async function deleteFromCart({
    input,
    ctx,
}: {
    input: TDeleteFromCartSchema
    ctx: UserContext
}) {
    try {
        const key = getCartKey(ctx.user.id)

        const field = constructField(input)
        await cache.hDel(key, field)

        return { success: true, message: "Item removed from cart" }
    } catch (error) {
        logger.error(error)
        throw new TRPCError({ message: "Failed to remove item", code: "INTERNAL_SERVER_ERROR" })
    }
}

/*
 * remove item quantity in user cart by 1
 */
export async function removeFromCart({
    input,
    ctx,
}: {
    input: TRemoveFromCartSchema
    ctx: UserContext
}) {
    try {
        const key = getCartKey(ctx.user.id)

        const item = input[0]
        const field = constructField(item)

        // 1. Enforce single-vendor lock across existing cart
        const existingFields = await cache.hKeys(key)
        if (existingFields.length > 0) {
            const currentVendorId = existingFields[0].split(":")[0]
            if (currentVendorId !== item.vendorId) {
                throw new TRPCError({
                    message:
                        "Cart contains items from another vendor. Clear cart first to shop from this vendor.",
                    code: "CONFLICT",
                })
            }
        }

        const currentQtyStr = await cache.hGet(key, field)
        const currentQty = currentQtyStr ? parseInt(currentQtyStr, 10) : 0

        if (currentQty <= 1) {
            await cache.hDel(key, field)
        } else {
            await cache.hIncrBy(key, field, -1)
        }

        return { success: true, message: "Cart updated" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to update cart", code: "INTERNAL_SERVER_ERROR" })
    }
}

/*
 * clear user cart (approved)
 */
export async function clearCart({ ctx }: { ctx: UserContext }) {
    try {
        await cache.del(getCartKey(ctx.user.id))
        return { success: true, message: "Cart cleared" }
    } catch (error) {
        logger.error(error)
        throw new TRPCError({ message: "Failed to clear cart", code: "INTERNAL_SERVER_ERROR" })
    }
}
