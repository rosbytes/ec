import { router, publicProcedure } from "../trpc/trpc"
import { z } from "zod"
export const authRouter = router({
    create: publicProcedure
        .input(
            z.object({
                title: z.string(),
            }),
        )
        .query(() => {
            // const { input } = opts

            // const input: {
            //     title: string
            // }
            // [...]
            return "heelo"
        }),
    list: publicProcedure.query(() => {
        // ...
        return "Hello"
    }),
})
