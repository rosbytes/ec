import { router, boardProcedure } from "../../trpc"
import { ZCreateProductSchema } from "./boardProduct.schema"

export const boardProductRouter = router({
    createGlobalProduct: boardProcedure.input(ZCreateProductSchema).mutation(async ({ input }) => {
        const { createGlobalProduct } = await import("./boardProduct.controller")
        return createGlobalProduct({ input })
    }),
})
