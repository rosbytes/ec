import { authRouter } from "../routes/auth.routes"
import { publicProcedure, router } from "./trpc"
import { z } from "zod"

// Define a simple router
export const appRouter = router({
    auth: authRouter,
    greeting: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return `Hello, ${input.name}! Welcome to tRPC`
        }),
})

// Export type definition of API
export type AppRouter = typeof appRouter
