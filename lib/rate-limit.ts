import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis from Upstash environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Auth Rate Limiter: 5 requests per 10 minutes per IP
// Use this for Login, Sign Up, Password Resets, Email Verification Resends
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/auth_v2",
});

// App Activity Rate Limiter: 5 requests per hour per IP (or per User ID)
// Use this for Meal Generation Requests to prevent AI credit abuse
export const generationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit/generation_v2", // change prefix to force immediate reset with new limit
});

// General API Rate Limiter: 100 requests per minute per IP
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});
