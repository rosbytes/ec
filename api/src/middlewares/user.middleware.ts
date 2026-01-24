import { t } from "../trpc"
import { TRPCError } from "@trpc/server"
import { verifyUserAccessToken } from "../utils"

// User Auth Middleware
export const isUser = t.middleware(async ({ ctx, next }) => {
    const token = ctx.req.headers.authorization?.split(" ")[1]
    if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" })

    try {
        const decoded = verifyUserAccessToken(token)
        return next({
            ctx: { user: decoded },
        })
    } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" })
    }
})
