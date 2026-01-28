import { t } from "../trpc/trpc"
import type { Context } from "../trpc"
import { TRPCError } from "@trpc/server"
import { verifyBoardAccessToken } from "../utils"

// Board Auth Middleware
export const isBoard = t.middleware(async ({ ctx, next }) => {
    const token = ctx.req.headers.authorization?.split(" ")[1]
    if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" })

    try {
        const decoded = verifyBoardAccessToken(token)
        return next({
            ctx: { board: decoded },
        })
    } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" })
    }
})

export type BoardContext = Context & { board: { id: string } }
