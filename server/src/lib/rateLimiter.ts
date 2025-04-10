import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";
import { Context, Env } from "hono";
import { env } from "hono/adapter";
import { BlankInput } from "hono/types";

const cache = new Map();

export class BlogRateLimiter {
  static instance: Ratelimit;

  static getInstance(c: Context<Env, "/api/v1", BlankInput>) {
    if (!this.instance) {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<{
        UPSTASH_REDIS_REST_URL: string;
        UPSTASH_REDIS_REST_TOKEN: string;
      }>(
        c as Context<{
          Bindings: {
            UPSTASH_REDIS_REST_URL: string;
            UPSTASH_REDIS_REST_TOKEN: string;
          };
        }>
      );

      const redisClient = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const rateLimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(20, "60 s"),
        ephemeralCache: cache,
      });

      this.instance = rateLimit;
      return this.instance;
    } else {
      return this.instance;
    }
  }
}

export class UserRateLimiter {
  static instance: Ratelimit;

  static getInstance(c: Context<Env, "/api/v1", BlankInput>) {
    if (!this.instance) {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<{
        UPSTASH_REDIS_REST_URL: string;
        UPSTASH_REDIS_REST_TOKEN: string;
      }>(
        c as Context<{
          Bindings: {
            UPSTASH_REDIS_REST_URL: string;
            UPSTASH_REDIS_REST_TOKEN: string;
          };
        }>
      );

      const redisClient = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const rateLimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(20, "60 s"),
        ephemeralCache: cache,
      });

      this.instance = rateLimit;
      return this.instance;
    } else {
      return this.instance;
    }
  }
}

export class AuthRateLimiter {
  static instance: Ratelimit;

  static getInstance(c: Context<Env, "/api/v1", BlankInput>) {
    if (!this.instance) {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<{
        UPSTASH_REDIS_REST_URL: string;
        UPSTASH_REDIS_REST_TOKEN: string;
      }>(
        c as Context<{
          Bindings: {
            UPSTASH_REDIS_REST_URL: string;
            UPSTASH_REDIS_REST_TOKEN: string;
          };
        }>
      );

      const redisClient = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const rateLimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(8, "43200 s"),
        ephemeralCache: cache,
      });

      this.instance = rateLimit;
      return this.instance;
    } else {
      return this.instance;
    }
  }
}
