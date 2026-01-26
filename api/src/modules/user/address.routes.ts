import { router, userProcedure } from "../../trpc"
import { ZCreateAddressSchema, ZDeleteAddressSchema, ZUpdateAddressSchema } from "./address.schema"

export const userAddressRouter = router({
    add: userProcedure.input(ZCreateAddressSchema).mutation(async ({ input, ctx }) => {
        const { addAddress } = await import("./address.controller")
        return addAddress({ input, ctx })
    }),

    list: userProcedure.query(async ({ ctx }) => {
        const { listAddresses } = await import("./address.controller")
        return listAddresses({ ctx })
    }),

    remove: userProcedure.input(ZDeleteAddressSchema).mutation(async ({ input, ctx }) => {
        const { removeAddress } = await import("./address.controller")
        return removeAddress({ input, ctx })
    }),

    update: userProcedure.input(ZUpdateAddressSchema).mutation(async ({ input, ctx }) => {
        const { updateAddress } = await import("./address.controller")
        return updateAddress({ input, ctx })
    }),
})
