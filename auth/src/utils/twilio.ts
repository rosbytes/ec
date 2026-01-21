import twilio from "twilio"
import dotenv from "dotenv"
import generateOtp from "./generateOtp"
import { ApiError } from "./ApiError"
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioPhone = process.env.TWILIO_VIRTUAL_NUMBER!

const client = twilio(accountSid, authToken)

export async function sendOtp(to: string, otp: string): Promise<void> {
  try {
    // Always ensure E.164 format (+91xxxxxxxxxx)
    if (!to.startsWith("+")) {
      throw new ApiError(400, "Invalid phone number format")
    }

    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: twilioPhone,
      to,
    })

    console.log(` OTP ${otp} sent to ${to} (SID: ${message.sid})`)
  } catch (error: any) {
    console.error(" Twilio sendOtp Error:", {
      code: error.code,
      message: error.message,
      info: error.moreInfo,
    })
    throw new ApiError(500, `Twilio Error: ${error.message}`)
  }
}
