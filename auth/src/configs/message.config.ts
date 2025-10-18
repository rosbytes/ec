import twilio from "twilio"
import { env } from "./env.config"

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)

export default async function sendOtp(otp: string, number: string) {
  const message = await client.messages.create({
    body: otp, // body of message
    to: number, // recipient number
    from: env.TWILIO_VIRTUAL_NUMBER, // The number from the message will be sent
  })
  return message.status
}
