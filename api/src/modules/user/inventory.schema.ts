import { z } from "zod"

/*
 *
 * Vendor NearBy Schema
 *
 * */
export const ZNearbyVendorInventorySchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
})

export type TNearbyVendorInventorySchema = z.infer<typeof ZNearbyVendorInventorySchema>
