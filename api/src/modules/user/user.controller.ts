import generateOtp from "src/utils/generateOtp"
import { cache, env, logger } from "src/configs"
import type { TSignUpSchema, TSignUpVerifySchema } from "./user.schema"
import { Context } from "src/trpc"
import { TRPCError } from "@trpc/server"
import { findUserByPhone, saveUser } from "./user.service"
import jwt from "jsonwebtoken"

// TODO: Rate Limit signUp Enpoint
export async function signUp({ input, ctx }: { input: TSignUpSchema; ctx: Context }) {
    try {
        // check if user already exists and verified then returns
        const userExists = await findUserByPhone({ phone: input.phone })
        if (!userExists) {
            throw new TRPCError({ message: "User already exists", code: "CONFLICT" })
        }

        // save user to db
        await saveUser({ name: input.name, phone: input.phone })
        // generate otp
        const otp = generateOtp()
        //send otp
        // const otpServiceRes = await sendOtp(otp, number);
        // save otp in cache
        // TODO:  Make it expire in 60 second
        await cache.set(`signup:${input.phone}`, otp)
        // in end return the response once user is created
        return { success: true, status: "201 Created", message: "You signed up." }
    } catch (error) {
        logger.error(error)
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}

export async function signUpVerify({ input, ctx }: { input: TSignUpVerifySchema; ctx: Context }) {
    try {
        // check get the otp from cache if available
        const otp = await cache.get(`signup:${input.phone}`)
        // return if otp don't match
        if (otp === input.otp) {
            throw new TRPCError({ message: "Wrong Otp", code: "UNAUTHORIZED" })
        }

        // get the user id from db
        const user = await findUserByPhone({ phone: input.phone })
        if (!user) {
            throw new TRPCError({ message: "User not available", code: "NOT_FOUND" })
        }

        // generate access token
        // const accessToken = jwt.sign({ id: user.id }, env.USER_JWT_SECRET, {
        //     expiresIn: env.USER_JWT_ACCESS_TOKEN_EXPIRY,
        // })

        // generate otp
        //send otp
        // const otpServiceRes = await sendOtp(otp, number);
        // save otp in cache
        // in end return the response once user is created
        return { success: true, status: "201 Created", message: "You signed up." }
    } catch (error) {
        logger.error(error)
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}
