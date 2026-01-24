import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../../../api/src/trpc" // path to your backend types
import { httpBatchLink } from "@trpc/client"

export const trpc = createTRPCReact<AppRouter>()

// Create the client
export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: `${process.env.BACKEND_URL}/trpc/`, // backend tRPC endpoint
        }),
    ],
})

console.log(await trpcClient.greeting.query({ name: "Bhawani Singh" }))
// console.log(trpc.greeting.useQuery({ name: "Bhawani" }))
const hello = await trpcClient.user.login.mutate({ phone: "+919772868352" })
console.log(hello)
