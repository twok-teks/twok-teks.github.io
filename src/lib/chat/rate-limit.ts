type Bucket = { count: number; resetAt: number };

/** Instance-local abuse guard. A shared production limiter belongs at the deployment edge. */
export function createRateLimiter(
  limit = 30,
  windowMs = 60_000,
  now: () => number = Date.now,
) {
  const buckets = new Map<string, Bucket>();
  return (request: Request): boolean => {
    const address = (
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    ).slice(0, 100);
    const time = now();
    const bucket = buckets.get(address);
    if (bucket && bucket.resetAt > time) {
      if (bucket.count >= limit) return false;
      bucket.count += 1;
      return true;
    }
    for (const [key, item] of buckets) {
      if (item.resetAt <= time) buckets.delete(key);
    }
    if (buckets.size >= 1_000) return false;
    buckets.set(address, { count: 1, resetAt: time + windowMs });
    return true;
  };
}
