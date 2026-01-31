import { db, board } from "../../db"
import { eq } from "drizzle-orm"

export const findBoardByPhone = async ({ phone }: { phone: string }) => {
    const [user] = await db.select().from(board).where(eq(board.phone, phone))
    return user
}

export const saveBoard = async ({
    firstName,
    lastName,
    phone,
    email,
}: {
    firstName: string
    lastName: string | undefined
    phone: string
    email: string
}) => {
    if (!lastName) {
        await db.insert(board).values({ firstName, phone, email })
    } else {
        await db.insert(board).values({ firstName, lastName, phone, email })
    }
}

export const updateBoard = async (phone: string, data: Partial<typeof board.$inferInsert>) => {
    // Filter out undefined values so they don't overwrite existing data with NULL
    const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))

    if (Object.keys(updateData).length === 0) return

    await db.update(board).set(updateData).where(eq(board.phone, phone))
}
