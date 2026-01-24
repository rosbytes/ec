import jwt from "jsonwebtoken"
import { env } from "../configs"

/*
 *
 *   User Access & Refresh Token
 *
 * */
export const generateUserAccessToken = ({ id }: { id: string }) => {
    return jwt.sign({ id }, env.USER_JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: env.USER_JWT_ACCESS_TOKEN_EXPIRY as any,
    })
}

export const generateUserRefreshToken = ({ id }: { id: string }) => {
    return jwt.sign({ id }, env.USER_JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: env.USER_JWT_REFRESH_TOKEN_EXPIRY as any,
    })
}

export const verifyUserAccessToken = (token: string) => {
    return jwt.verify(token, env.USER_JWT_ACCESS_TOKEN_SECRET) as { id: string }
}

export const verifyUserRefreshToken = (token: string) => {
    return jwt.verify(token, env.USER_JWT_REFRESH_TOKEN_SECRET) as { id: string }
}

/*
 *
 *   Vendor Access & Refresh Token
 *
 * */
export const generateVendorAccessToken = ({ id }: { id: string }) => {
    return jwt.sign({ id }, env.VENDOR_JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: env.VENDOR_JWT_ACCESS_TOKEN_EXPIRY as any,
    })
}

export const generateVendorRefreshToken = ({ id }: { id: string }) => {
    return jwt.sign({ id }, env.VENDOR_JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: env.VENDOR_JWT_REFRESH_TOKEN_EXPIRY as any,
    })
}

export const verifyVendorAccessToken = (token: string) => {
    return jwt.verify(token, env.VENDOR_JWT_ACCESS_TOKEN_SECRET) as { id: string }
}

export const verifyVendorRefreshToken = (token: string) => {
    return jwt.verify(token, env.VENDOR_JWT_REFRESH_TOKEN_SECRET) as { id: string }
}
