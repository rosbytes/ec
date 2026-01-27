import { TRPCError } from "@trpc/server"
import { logger } from "../../configs"
import type { TCreateProductSchema } from "./boardProduct.schema"
import { createGlobalProduct as createProductService } from "./boardProduct.service"

export async function createGlobalProduct({ input }: { input: TCreateProductSchema }) {
    try {
        const result = await createProductService(input)
        return {
            success: true,
            message: "Global product created successfully",
            productId: result.productId,
        }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
            message: "Failed to create global product",
            code: "INTERNAL_SERVER_ERROR",
        })
    }
}
