import { db, users } from "../../db"
import { eq } from "drizzle-orm"

export const findUserByPhone = async ({ phone }: { phone: string }) => {
    const [user] = await db.select().from(users).where(eq(users.phone, phone))
    return user
}

export const saveUser = async ({
    firstName,
    lastName,
    phone,
}: {
    firstName: string
    lastName: string | undefined
    phone: string
}) => {
    if (!lastName) {
        await db.insert(users).values({ firstName, phone })
    } else {
        await db.insert(users).values({ firstName, lastName, phone })
    }
}

export const updateUser = async (phone: string, data: Partial<typeof users.$inferInsert>) => {
    // Filter out undefined values so they don't overwrite existing data with NULL
    const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))

    if (Object.keys(updateData).length === 0) return

    await db.update(users).set(updateData).where(eq(users.phone, phone))
}
