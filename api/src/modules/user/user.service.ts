import { db, users } from "../../db"
import { eq } from "drizzle-orm"

export const findUserByPhone = async ({ phone }: { phone: string }) => {
    const [user] = await db.select().from(users).where(eq(users.phone, phone))
    return user
}

export const saveUser = async ({ name, phone }: { name: string; phone: string }) => {
    await db.insert(users).values({ name, phone })
}
