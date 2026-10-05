import "server-only";
import { AllModelsBusyError, ClientAbortedError } from "./ai";
import { msg } from "./messages";

/**
 * Best-effort per-IP rate limit. In-memory, so it is per server instance and
 * resets on cold start: enough to stop casual abuse of a public demo key.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function isRateLimited(key: string, max: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export const TOO_MANY = (req: Request) => jsonError(msg(req, "tooMany"), 429);

/** Turn any server error into a clear, user-facing message (never leak details). */
export function errorResponse(error: unknown, req: Request) {
  if (error instanceof ClientAbortedError) return jsonError(msg(req, "cancelled"), 499);
  if (error instanceof AllModelsBusyError) return jsonError(msg(req, "busy"), 503);
  console.error("[api] unexpected error", error);
  return jsonError(msg(req, "generic"), 500);
}
