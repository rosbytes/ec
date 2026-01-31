import { router, boardProcedure } from "../../trpc"
import { ZCreateProductSchema } from "./product.schema"

export const boardProductRouter = router({
    createGlobalProduct: boardProcedure.input(ZCreateProductSchema).mutation(async ({ input }) => {
        const { createGlobalProduct } = await import("./product.controller")
        return createGlobalProduct({ input })
    }),
})
