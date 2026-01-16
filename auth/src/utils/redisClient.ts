import Redis from "ioredis"
import { config } from "dotenv"
config()

const redisUrl = process.env.REDIS_URL
if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not defined")
}

export const redisClient = new Redis(redisUrl)

redisClient.on("ready", () => {
  console.log("Redis is READY and usable")
})

redisClient.on("connect", () => console.log(" Connected to Redis"))
redisClient.on("error", (err) => console.error(" Redis error:", err?.stack,err.message))
