import logger from "@configs/logger.config"
import express, { NextFunction, Request, Response } from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "@routes/auth-routes"

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`received ${req.method} request to ${req.url}`)
  logger.info(`request body ${JSON.stringify(req.body)}`)
  next()
})

app.use("/api/auth", router)
app.listen(SERVER_PORT, () => {
  logger.info(`Server is started at: ${SERVER_PORT}`)
})
