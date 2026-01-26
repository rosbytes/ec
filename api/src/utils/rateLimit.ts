import { TRPCError } from "@trpc/server"
import { cache } from "../configs"

/**
 * Fixed Window Rate Limiter
 */
export const rateLimit = async (key: string, limit: number, windowSeconds: number) => {
    const current = await cache.incr(key)
    if (current === 1) {
        await cache.expire(key, windowSeconds)
    }
    if (current > limit) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests. Please try again later.",
        })
    }
}

/**
 * Token Bucket Rate Limiter
 * @param key Redis key
 * @param limit Max tokens (Capacity)
 * @param refillRate Tokens added per interval
 * @param refillSeconds Interval in seconds
 */

// TODO: Review this token Bucket limitter, It is written by AI.
export const tokenBucket = async (key: string, limit: number, refillRate: number, refillSeconds: number) => {
    const luaScript = `
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local refill_interval = tonumber(ARGV[3])
        local now = tonumber(ARGV[4])

        local bucket = redis.call('hmget', key, 'tokens', 'last_refill')
        local tokens = tonumber(bucket[1])
        local last_refill = tonumber(bucket[2])

        if tokens == nil then
            tokens = capacity
            last_refill = now
        else
            local elapsed = now - last_refill
            local refill = math.floor(elapsed / refill_interval) * refill_rate
            tokens = math.min(capacity, tokens + refill)
            if refill > 0 then
                last_refill = last_refill + (math.floor(elapsed / refill_interval) * refill_interval)
            end
        end

        if tokens >= 1 then
            tokens = tokens - 1
            redis.call('hmset', key, 'tokens', tokens, 'last_refill', last_refill)
            redis.call('expire', key, refill_interval * 2 + 60)
            return 1
        else
            return 0
        end
    `

    const result = await cache.eval(luaScript, {
        keys: [key],
        arguments: [
            limit.toString(),
            refillRate.toString(),
            refillSeconds.toString(),
            Math.floor(Date.now() / 1000).toString(),
        ],
    })

    if (result === 0) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests. Please try again later.",
        })
    }
}
