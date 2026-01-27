import { router, userProcedure } from "../../trpc"
import { ZNearbyVendorInventorySchema } from "./inventory.schema"

export const userInventoryRouter = router({
    // user nearby vendor endpoit
    nearestVendorAndInventory: userProcedure
        .input(ZNearbyVendorInventorySchema)
        .mutation(async ({ input, ctx }) => {
            const { nearbyVendorInventory } = await import("./inventory.controller")
            return nearbyVendorInventory({ input, ctx })
        }),
})
