import "server-only";
import { AllModelsBusyError, ClientAbortedError, type FailureReason } from "./ai";
import { msg, type MessageKey } from "./messages";

/**
 * Best-effort per-IP rate limit. In-memory, so it is per server instance and
 * resets on cold start: enough to stop casual abuse of a public demo key.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Returns 0 when the request may proceed, otherwise the seconds to wait. */
export function isRateLimited(key: string, max: number, windowMs = 60_000): number {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return 0;
  }
  entry.count += 1;
  return entry.count > max ? Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) : 0;
}

/** `retryable: false` tells the UI to hide "Try again" (e.g. daily quota used up). */
export function jsonError(message: string, status: number, retryable = true, headers?: HeadersInit) {
  return Response.json({ error: message, retryable }, { status, headers });
}

export const TOO_MANY = (req: Request, seconds: number) =>
  jsonError(msg(req, "tooMany", seconds), 429, true, { "Retry-After": String(seconds) });

const REASON_MESSAGE: Record<FailureReason, MessageKey> = {
  "quota-day": "quotaDay",
  "quota-minute": "quotaMinute",
  quota: "quota",
  overload: "overload",
  unavailable: "overload",
  timeout: "timeout",
  "bad-output": "badOutput",
};

/** Turn any server error into a clear, user-facing message (never leak details). */
export function errorResponse(error: unknown, req: Request) {
  if (error instanceof ClientAbortedError) return jsonError(msg(req, "cancelled"), 499);
  if (error instanceof AllModelsBusyError) {
    console.warn(`[api] all models failed: ${error.reason}`);
    const status = error.reason.startsWith("quota") ? 429 : error.reason === "bad-output" ? 502 : 503;
    return jsonError(msg(req, REASON_MESSAGE[error.reason]), status, error.reason !== "quota-day");
  }
  console.error("[api] unexpected error", error);
  return jsonError(msg(req, "generic"), 500);
}
