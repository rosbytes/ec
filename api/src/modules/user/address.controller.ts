import { Context } from "../../trpc"
import { TRPCError } from "@trpc/server"
import { TCreateAddressSchema, TDeleteAddressSchema, TUpdateAddressSchema } from "./address.schema"
import {
    deleteAddressById,
    getAddressCountByUserId,
    getAddressesByUserId,
    saveAddress,
    updateAddressById,
} from "./address.service"
import { logger } from "../../configs"
import { UserContext } from "../../middlewares"

// create userAddress
// TODO: can implement some address caching and rate Limitting
export async function addAddress({ input, ctx }: { input: TCreateAddressSchema; ctx: UserContext }) {
    try {
        const addressCount = await getAddressCountByUserId(ctx.user.id)
        if (addressCount >= 10) {
            throw new TRPCError({ message: "You can only have up to 10 saved addresses", code: "BAD_REQUEST" })
        }
        const address = await saveAddress(ctx.user.id, input)
        return { success: true, message: "Address added successfully", address }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to add address", code: "INTERNAL_SERVER_ERROR" })
    }
}

// getAll userAddress
// TODO: can implement some address caching and rate Limitting
export async function listAddresses({ ctx }: { ctx: UserContext }) {
    try {
        const addresses = await getAddressesByUserId(ctx.user.id)
        return { success: true, addresses }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to fetch addresses", code: "INTERNAL_SERVER_ERROR" })
    }
}

// delete
// TODO: can implement some address caching and rate Limitting
export async function removeAddress({ input, ctx }: { input: TDeleteAddressSchema; ctx: UserContext }) {
    try {
        const deleted = await deleteAddressById(ctx.user.id, input.id)
        if (!deleted) {
            throw new TRPCError({ message: "Address not found or unauthorized", code: "NOT_FOUND" })
        }
        return { success: true, message: "Address removed successfully" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to remove address", code: "INTERNAL_SERVER_ERROR" })
    }
}

// update
// TODO: can implement some address caching and rate Limitting
export async function updateAddress({ input, ctx }: { input: TUpdateAddressSchema; ctx: UserContext }) {
    try {
        const updated = await updateAddressById(ctx.user.id, input)
        if (!updated) {
            throw new TRPCError({ message: "Address not found or unauthorized", code: "NOT_FOUND" })
        }
        return { success: true, message: "Address updated successfully" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Failed to update address", code: "INTERNAL_SERVER_ERROR" })
    }
}
