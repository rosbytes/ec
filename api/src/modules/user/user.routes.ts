import { router, publicProcedure } from "../../trpc"
import { ZSignUpSchema, ZSignUpVerifySchema } from "./user.schema"

export const userRouter = router({
    // user SignUp endpoit
    signUp: publicProcedure.input(ZSignUpSchema).query(async ({ input, ctx }) => {
        const { signUp } = await import("./user.controller")
        return signUp({ input, ctx })
    }),
    signUpVerify: publicProcedure.input(ZSignUpVerifySchema).query(async ({ input, ctx }) => {
        const { signUpVerify } = await import("./user.controller")
        return signUpVerify({ input, ctx })
    }),
})
