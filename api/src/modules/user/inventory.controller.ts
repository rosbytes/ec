import { rateLimit } from "../../utils"
import { logger } from "../../configs"
import type { TNearbyVendorInventorySchema } from "./inventory.schema"
import type { UserContext } from "../../middlewares"
import { TRPCError } from "@trpc/server"
import { vendorInventory, nearestActiveVendorInRadius } from "./inventory.service"

export async function nearbyVendorInventory({
    input,
    ctx,
}: {
    input: TNearbyVendorInventorySchema
    ctx: UserContext
}) {
    try {
        await rateLimit(`rateLimit:user:NearbyVendorInventory:ip:${ctx.req.ip}`, 5, 60)
        await rateLimit(`rateLimit:user:NearbyVendorInventory:phone:${ctx.user.id}`, 2, 120)
        // nearest active vendor in radius of 5km
        const vendor = await nearestActiveVendorInRadius(input.latitude, input.longitude)

        if (!vendor)
            throw new TRPCError({ message: "No vendor found in radius", code: "NOT_FOUND" })

        // pull inventory of this vendor
        const inventory = await vendorInventory({ vendorId: vendor.id })

        return { vendor, inventory }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}
