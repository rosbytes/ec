import {
    userAuthRouter,
    userAddressRouter,
    cartRouter,
    boardRouter,
    userInventoryRouter,
} from "../modules"
import { publicProcedure, router } from "./globals"
import { z } from "zod"

// Define a simple router
export const appRouter = router({
    user: {
        auth: userAuthRouter,
        address: userAddressRouter,
        cart: cartRouter,
        inventory: userInventoryRouter,
    },
    board: boardRouter,
    // initial setup testing procedure/endpoint
    greeting: publicProcedure.input(z.object({ name: z.string() })).query(({ input }) => {
        return `Hello, ${input.name}! Welcome to tRPC`
    }),
})

// Export type definition of API
export type AppRouter = typeof appRouter
