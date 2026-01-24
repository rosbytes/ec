import {
    generateUserAccessToken,
    generateUserRefreshToken,
    generateOtp,
    rateLimit,
    verifyUserRefreshToken,
} from "../../utils"
import { cache, env, logger, sendOtp } from "../../configs"
import type {
    TLoginSchema,
    TLoginVerifySchema,
    TRefreshTokenSchema,
    TSignUpSchema,
    TSignUpVerifySchema,
} from "./user.schema"
import { Context } from "../../trpc"
import { TRPCError } from "@trpc/server"
import { findUserByPhone, saveUser, updateUser } from "./user.service"

export async function signUp({ input, ctx }: { input: TSignUpSchema; ctx: Context }) {
    try {
        await rateLimit(`rateLimit:signUp:ip:${ctx.req.ip}`, 5, 60)
        await rateLimit(`rateLimit:signUp:phone:${input.phone}`, 2, 120)
        // check if user already exists and verified then returns
        const userExists = await findUserByPhone({ phone: input.phone })
        if (userExists) {
            if (userExists.verified) {
                throw new TRPCError({ message: "User already exists", code: "CONFLICT" })
            }
            // If user exists but not verified, update details and resend OTP
            await updateUser(input.phone, { firstName: input.firstName, lastName: input.lastName })
        } else {
            // save user to db
            await saveUser({ firstName: input.firstName, lastName: input.lastName, phone: input.phone })
        }

        // generate otp
        const otp = generateOtp()
        // send otp in production, in development use otp from redis client
        if (env.NODE_ENV === "production") {
            await sendOtp(otp, input.phone)
        }
        // save otp in cache
        await cache.set(`signup:${input.phone}`, otp, { EX: 300 }) // Expire in 5 minutes
        // in end return the response once user is created
        ctx.res.status(201)
        return { success: true, message: "You signed up." }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}

// verify signup
export async function signUpVerify({ input, ctx }: { input: TSignUpVerifySchema; ctx: Context }) {
    try {
        await rateLimit(`rateLimit:signUpVerify:ip:${ctx.req.ip}`, 5, 60)
        await rateLimit(`rateLimit:signUpVerify:phone:${input.phone}`, 5, 60) // Higher limit for verification attempts
        // check get the otp from cache if available
        const otp = await cache.get(`signup:${input.phone}`)
        // return if otp don't match
        if (otp !== input.otp) {
            throw new TRPCError({ message: "Wrong Otp", code: "UNAUTHORIZED" })
        }

        // get the user id from db
        const user = await findUserByPhone({ phone: input.phone })
        if (!user) {
            throw new TRPCError({ message: "User not available", code: "NOT_FOUND" })
        }

        // generate tokens
        const accessToken = generateUserAccessToken({ id: user.id })
        const refreshToken = generateUserRefreshToken({ id: user.id })

        // Mark user as verified
        await updateUser(user.phone, { verified: true })

        // save refresh token in cache (Expire in 30 days)
        await cache.set(`refreshToken:${user.id}`, refreshToken, { EX: 60 * 60 * 24 * 30 })

        // set headers
        ctx.res.setHeader("Authorization", `Bearer ${accessToken}`)
        ctx.res.setHeader("x-refresh-token", refreshToken)

        return { success: true, status: "200 Ok", message: "Login Successful" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}

export async function login({ input, ctx }: { input: TLoginSchema; ctx: Context }) {
    try {
        await rateLimit(`rateLimit:login:ip:${ctx.req.ip}`, 5, 60)
        await rateLimit(`rateLimit:login:phone:${input.phone}`, 2, 120)
        // check if user already exists and verified then returns
        const userExists = await findUserByPhone({ phone: input.phone })
        if (!userExists || !userExists.verified) {
            throw new TRPCError({ message: "User not available or not verified", code: "UNAUTHORIZED" })
        }

        // generate otp
        const otp = generateOtp()
        // send otp in production, in development use otp from redis client
        if (env.NODE_ENV === "production") {
            await sendOtp(otp, input.phone)
        }
        // save otp in cache
        await cache.set(`login:${input.phone}`, otp, { EX: 300 }) // Expire in 5 minutes
        // in end return the response once otp is sent
        ctx.res.status(201)
        return { success: true, message: "Otp sent successfully" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}

export async function loginVerify({ input, ctx }: { input: TLoginVerifySchema; ctx: Context }) {
    try {
        await rateLimit(`rateLimit:loginVerify:ip:${ctx.req.ip}`, 5, 60)
        await rateLimit(`rateLimit:loginVerify:phone:${input.phone}`, 5, 60) // Higher limit for verification attempts
        // check get the otp from cache if available
        const otp = await cache.get(`login:${input.phone}`)
        // return if otp don't match
        if (otp !== input.otp) {
            throw new TRPCError({ message: "Wrong Otp", code: "UNAUTHORIZED" })
        }

        // get the user id from db
        const user = await findUserByPhone({ phone: input.phone })
        if (!user) {
            throw new TRPCError({ message: "User not available", code: "NOT_FOUND" })
        }

        // generate tokens
        const accessToken = generateUserAccessToken({ id: user.id })
        const refreshToken = generateUserRefreshToken({ id: user.id })

        // save refresh token in cache
        await cache.set(`refreshToken:${user.id}`, refreshToken)

        // set headers
        ctx.res.setHeader("Authorization", `Bearer ${accessToken}`)
        ctx.res.setHeader("x-refresh-token", refreshToken)

        return { success: true, status: "200 Ok", message: "Login Successful" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}

export async function refreshTokens({ input, ctx }: { input: TRefreshTokenSchema; ctx: Context }) {
    try {
        await rateLimit(`rateLimit:refreshToken:ip:${ctx.req.ip}`, 10, 60)

        // 1. Verify Refresh Token JWT
        let decoded: { id: string }
        try {
            decoded = verifyUserRefreshToken(input.refreshToken)
        } catch (err) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid refresh token" })
        }

        // 2. Check Redis for this user's token
        const storedToken = await cache.get(`refreshToken:${decoded.id}`)
        if (storedToken !== input.refreshToken) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Token expired or revoked" })
        }

        // 3. Check if user still exists
        const user = await findUserByPhone({ phone: decoded.id })
        if (!user) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "User not available" })
        }

        // 4. Generate new tokens
        const accessToken = generateUserAccessToken({ id: decoded.id })
        const refreshToken = generateUserRefreshToken({ id: decoded.id })

        // 5. TODO: Expiry time should be set dynamically, not Hard code, use may be env
        await cache.set(`refreshToken:${decoded.id}`, refreshToken, { EX: 60 * 60 * 24 * 30 })

        // 6. Set headers
        ctx.res.setHeader("Authorization", `Bearer ${accessToken}`)
        ctx.res.setHeader("x-refresh-token", refreshToken)

        return { success: true, message: "Tokens refreshed" }
    } catch (error) {
        logger.error(error)
        if (error instanceof TRPCError) throw error
        throw new TRPCError({ message: "Something Went Wrong", code: "INTERNAL_SERVER_ERROR" })
    }
}
