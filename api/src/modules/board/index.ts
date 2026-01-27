import { router } from "../../trpc"
import { boardAuthRouter } from "./board.route"
import { boardProductRouter } from "./boardProduct.route"

export const boardRouter = router({
    auth: boardAuthRouter,
    product: boardProductRouter,
})
