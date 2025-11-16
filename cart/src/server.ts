import app from "./app.js"
import logger from "./config/logger.config.js"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.SERVER_PORT || 4003;

app.listen(PORT,()=>{
    logger.info(`cart service is running on ${PORT}`)
})