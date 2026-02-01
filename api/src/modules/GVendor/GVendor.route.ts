import { router, publicProcedure } from "../../trpc"
import {
    ZLoginSchema,
    ZLoginVerifySchema,
    ZRefreshTokenSchema,
    ZSignUpSchema,
    ZSignUpVerifySchema,
} from "./GVendor.schema"

export const boardAuthRouter = router({
    // user SignUp endpoit
    signUp: publicProcedure.input(ZSignUpSchema).mutation(async ({ input, ctx }) => {
        const { signUp } = await import("./GVendor.controller")
        return signUp({ input, ctx })
    }),

    // verify sign up
    signUpVerify: publicProcedure.input(ZSignUpVerifySchema).mutation(async ({ input, ctx }) => {
        const { signUpVerify } = await import("./GVendor.controller")
        return signUpVerify({ input, ctx })
    }),

    // login
    login: publicProcedure.input(ZLoginSchema).mutation(async ({ input, ctx }) => {
        const { login } = await import("./GVendor.controller")
        return login({ input, ctx })
    }),

    // verify login
    loginVerify: publicProcedure.input(ZLoginVerifySchema).mutation(async ({ input, ctx }) => {
        const { loginVerify } = await import("./GVendor.controller")
        return loginVerify({ input, ctx })
    }),

    // refresh tokens
    refreshTokens: publicProcedure.input(ZRefreshTokenSchema).mutation(async ({ input, ctx }) => {
        const { refreshTokens } = await import("./GVendor.controller")
        return refreshTokens({ input, ctx })
    }),
})
