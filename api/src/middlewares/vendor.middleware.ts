import { TRPCError } from "@trpc/server"
import { verifyVendorAccessToken } from "../utils"
import { t } from "../trpc"

// Vendor Auth Middleware
export const isVendor = t.middleware(async ({ ctx, next }) => {
    const token = ctx.req.headers.authorization?.split(" ")[1]
    if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing token" })

    try {
        const decoded = verifyVendorAccessToken(token)
        return next({
            ctx: { vendor: decoded },
        })
    } catch (err) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" })
    }
})
