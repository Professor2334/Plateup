import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://massive-sunbeam-130946.upstash.io",
  token: "gQAAAAAAAf-CAAIgcDFmMjkyM2UxNDI5NDc0NzFmOTkxNTMyNGM5MmQ3YjYzYg",
});

const limit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "@upstash/ratelimit/generation",
});

async function test() {
  const { success, limit: total, remaining, reset } = await limit.limit("test_user_id");
  console.log({ success, total, remaining, reset });
}

test().catch(console.error);
