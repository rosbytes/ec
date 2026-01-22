import express from "express"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./trpc"
import cors from "cors"
import { connectCache, env, logger } from "./configs"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is working")
})

// tRPC endpoint
app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: () => ({}), // context for auth/db, empty for now
    }),
)

app.listen(env.SERVER_PORT, async () => {
    logger.info(`Server is runnig on port: ${env.SERVER_PORT}, `)
    await connectCache()
})
