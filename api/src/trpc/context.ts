import { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import { db } from "../db/db"

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
    db,
})

export type Context = Awaited<ReturnType<typeof createContext>>
