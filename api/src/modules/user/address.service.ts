import { db, userAddresses } from "../../db"
import { eq, and } from "drizzle-orm"
import { TCreateAddressSchema, TUpdateAddressSchema } from "./address.schema"

// save user's address to db
export const saveAddress = async (userId: string, data: TCreateAddressSchema) => {
    const [address] = await db
        .insert(userAddresses)
        .values({
            userId,
            phone: data.phone,
            label: data.label,
            address: data.address,
            location: { x: data.location.lng, y: data.location.lat },
        })
        .returning()
    return address
}

// return count of user's all address
export const getAddressCountByUserId = async (userId: string) => {
    return await db.$count(userAddresses, eq(userAddresses.userId, userId))
}

// return all address of user
export const getAddressesByUserId = async (userId: string) => {
    return await db.select().from(userAddresses).where(eq(userAddresses.userId, userId))
}

// delete userAddress by id
export const deleteAddressById = async (userId: string, addressId: string) => {
    const [deleted] = await db
        .delete(userAddresses)
        .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)))
        .returning()
    return deleted
}

// update userAddress by id
export const updateAddressById = async (userId: string, data: TUpdateAddressSchema) => {
    const [updated] = await db
        .update(userAddresses)
        .set({
            phone: data.phone,
            label: data.label,
            address: data.address,
            location: { x: data.location.lng, y: data.location.lat },
        })
        .where(and(eq(userAddresses.id, data.id), eq(userAddresses.userId, userId)))
        .returning()
    return updated
}
