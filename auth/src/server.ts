import { env } from "@configs/env.config"
import logger from "@configs/logger.config"
import express from "express"

const app = express()

app.get("/", (req, res) => {
  console.log("server starting")
  res.json({
    success: "true",
    message: " Server is running",
  })
})

app.listen(env.SERVER_PORT, () => {
  logger.info(`Server is started at: ${env.SERVER_PORT}`)
})
