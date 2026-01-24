import { router, publicProcedure, userProcedure } from "../../trpc"
// import { ZFindNearbyVendorsSchema } from "../discovery/discovery.schema"
// import { addressRouter } from "./address.routes"
import {
    ZLoginSchema,
    ZLoginVerifySchema,
    ZRefreshTokenSchema,
    ZSignUpSchema,
    ZSignUpVerifySchema,
} from "./user.schema"

export const userRouter = router({
    // user SignUp endpoit
    signUp: publicProcedure.input(ZSignUpSchema).mutation(async ({ input, ctx }) => {
        const { signUp } = await import("./user.controller")
        return signUp({ input, ctx })
    }),

    // verify sign up
    signUpVerify: publicProcedure.input(ZSignUpVerifySchema).mutation(async ({ input, ctx }) => {
        const { signUpVerify } = await import("./user.controller")
        return signUpVerify({ input, ctx })
    }),

    // login
    login: publicProcedure.input(ZLoginSchema).mutation(async ({ input, ctx }) => {
        const { login } = await import("./user.controller")
        return login({ input, ctx })
    }),

    // verify login
    loginVerify: publicProcedure.input(ZLoginVerifySchema).mutation(async ({ input, ctx }) => {
        const { loginVerify } = await import("./user.controller")
        return loginVerify({ input, ctx })
    }),

    // refresh tokens
    refreshTokens: publicProcedure.input(ZRefreshTokenSchema).mutation(async ({ input, ctx }) => {
        const { refreshTokens } = await import("./user.controller")
        return refreshTokens({ input, ctx })
    }),

    // user address
    // address: addressRouter,

    // nearby vendors
    // nearbyVendors: userProcedure.input(ZFindNearbyVendorsSchema).query(async ({ input, ctx }) => {
    //     const { findNearbyVendors } = await import("../discovery/discovery.controller")
    //     return findNearbyVendors({ input, ctx })
    // }),
})
