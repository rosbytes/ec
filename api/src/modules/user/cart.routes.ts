import { router, userProcedure } from "../../trpc"
import { ZAddToCartSchema, ZRemoveFromCartSchema, ZDeleteFromCartSchema } from "./cart.schema"

export const cartRouter = router({
    getAllCartItems: userProcedure.query(async ({ ctx }) => {
        const { getCart } = await import("./cart.controller")
        return getCart({ ctx })
    }),

    addToCart: userProcedure.input(ZAddToCartSchema).mutation(async ({ input, ctx }) => {
        const { addToCart } = await import("./cart.controller")
        return addToCart({ input, ctx })
    }),

    removeFromCart: userProcedure.input(ZRemoveFromCartSchema).mutation(async ({ input, ctx }) => {
        const { removeFromCart } = await import("./cart.controller")
        return removeFromCart({ input, ctx })
    }),

    deleteFromCart: userProcedure.input(ZDeleteFromCartSchema).mutation(async ({ input, ctx }) => {
        const { deleteFromCart } = await import("./cart.controller")
        return deleteFromCart({ input, ctx })
    }),

    clearCart: userProcedure.mutation(async ({ ctx }) => {
        const { clearCart } = await import("./cart.controller")
        return clearCart({ ctx })
    }),
})
