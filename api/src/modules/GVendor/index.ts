import { router } from "../../trpc"
import { boardAuthRouter } from "./GVendor.route"
import { boardProductRouter } from "./product.route"

export const boardRouter = router({
    auth: boardAuthRouter,
    product: boardProductRouter,
})
