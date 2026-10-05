import "server-only";
import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import {
  APICallError,
  NoObjectGeneratedError,
  NoOutputGeneratedError,
  RetryError,
  generateText,
  streamText,
  type TextStreamPart,
  type ToolSet,
} from "ai";

/**
 * Free-tier Gemini quotas are per model, so we try models in order and move on
 * when one is out of quota or overloaded. Flash Lite comes first: on 2026-10-05
 * every free-tier Flash model returned 503 "high demand" while Flash Lite
 * answered in 4–8 s with good quality in our tests. Flash stays as a fallback.
 * Override with KALEM_MODELS="id1,id2" (e.g. Flash first on a paid key).
 */
const DEFAULT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
];

/** Routes run with maxDuration = 60 s; stop trying new models well before that. */
const TOTAL_BUDGET_MS = 50_000;
/** Give up on one model after this long (generate) and try the next one. */
const ATTEMPT_TIMEOUT_MS = 25_000;
/** For streaming: the model must start answering within this time. */
const FIRST_CHUNK_TIMEOUT_MS = 15_000;
/** Don't start a new attempt with less time than this left. */
const MIN_ATTEMPT_MS = 6_000;

export function modelChain(): string[] {
  const fromEnv = process.env.KALEM_MODELS?.split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_MODELS;
}

/** Keep latency low; thinking level names differ per model family. */
/** "fast" for chat and drafts; "careful" where correctness matters more than speed (quiz answer keys). */
export type Effort = "fast" | "careful";

function providerOptionsFor(modelId: string, effort: Effort = "fast") {
  const google: GoogleLanguageModelOptions = {
    safetySettings: [
      // BLOCK_LOW_AND_ABOVE silently cut normal science answers and blocked
      // supportive replies to students in distress (tested 2026-10-05), so we use
      // medium thresholds and rely on the prompt + crisis responder for safety.
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };
  if (/^gemini-3\.(8|7|6)-flash$/.test(modelId)) google.thinkingConfig = { thinkingLevel: effort === "careful" ? "medium" : "low" };
  if (modelId === "gemini-3.5-flash-lite") google.thinkingConfig = { thinkingLevel: effort === "careful" ? "medium" : "minimal" };
  return { google };
}

/**
 * True when the error means "try another model": quota (429), overload (5xx),
 * model not available for this key (403/404), timeouts, or output that failed
 * schema validation / came back empty.
 */
export function isRetryableModelError(error: unknown): boolean {
  if (NoObjectGeneratedError.isInstance(error) || NoOutputGeneratedError.isInstance(error)) return true;
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return true;
  if (!APICallError.isInstance(e)) return false;
  const s = e.statusCode ?? 0;
  return s === 429 || s === 403 || s === 404 || s >= 500 || e.isRetryable;
}

function describe(error: unknown): string {
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (APICallError.isInstance(e)) return `HTTP ${e.statusCode ?? "?"}: ${e.message.slice(0, 160)}`;
  return error instanceof Error ? `${error.name}: ${error.message.slice(0, 160)}` : String(error).slice(0, 160);
}

/** Why a model attempt failed, in terms a user can act on. */
export type FailureReason = "quota-day" | "quota-minute" | "quota" | "overload" | "timeout" | "bad-output" | "unavailable";

function classify(error: unknown): FailureReason {
  if (NoObjectGeneratedError.isInstance(error) || NoOutputGeneratedError.isInstance(error)) return "bad-output";
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return "timeout";
  if (!APICallError.isInstance(e)) return "overload";
  const s = e.statusCode ?? 0;
  if (s === 429) {
    // Google's quota errors name the exhausted limit (e.g. "...PerDay..." / "...PerMinute...").
    const text = `${e.message} ${e.responseBody ?? ""}`;
    if (/per\s?day/i.test(text)) return "quota-day";
    if (/per\s?minute/i.test(text)) return "quota-minute";
    return "quota";
  }
  if (s === 403 || s === 404) return "unavailable";
  return "overload";
}

export class AllModelsBusyError extends Error {
  readonly reason: FailureReason;
  constructor(failures: unknown[]) {
    super("All AI models are busy or out of quota right now.");
    this.name = "AllModelsBusyError";
    this.cause = failures.at(-1);
    const reasons = failures.map(classify);
    // The most actionable explanation wins: a daily limit means "come back later",
    // a per-minute limit means "wait a minute", otherwise it's load or a bad answer.
    this.reason = reasons.includes("quota-day")
      ? "quota-day"
      : reasons.includes("quota-minute")
        ? "quota-minute"
        : reasons.includes("quota")
          ? "quota"
          : reasons.includes("bad-output") && !reasons.includes("overload")
            ? "bad-output"
            : reasons.includes("timeout") && !reasons.includes("overload")
              ? "timeout"
              : "overload";
  }
}

/** The client went away (Stop button, closed tab): don't fall back, just stop. */
export class ClientAbortedError extends Error {
  constructor() {
    super("The request was cancelled by the client.");
    this.name = "ClientAbortedError";
  }
}

function attemptSignal(controller: AbortController, external: AbortSignal | undefined, ms: number) {
  const signals = [controller.signal, AbortSignal.timeout(ms)];
  if (external) signals.push(external);
  return AbortSignal.any(signals);
}

type GenerateArgs = Omit<Parameters<typeof generateText>[0], "model" | "maxRetries" | "providerOptions" | "abortSignal">;

/**
 * generateText with model fallback. Use with `output: Output.object(...)`.
 * Returns the validated output; invalid/empty output counts as a failed attempt.
 */
export async function generateWithFallback<T>(
  args: GenerateArgs,
  signal?: AbortSignal,
  effort: Effort = "fast",
): Promise<{ output: T; modelId: string }> {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const failures: unknown[] = [];
  for (const id of modelChain()) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;
    const controller = new AbortController();
    try {
      const result = await generateText({
        ...args,
        model: google(id),
        maxRetries: 0,
        abortSignal: attemptSignal(controller, signal, Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
        providerOptions: providerOptionsFor(id, effort),
      } as Parameters<typeof generateText>[0]);
      // Reading `output` throws if it is missing (e.g. blocked by a safety filter).
      const output = result.output as T;
      if (output == null) throw new NoOutputGeneratedError({ message: "Empty output" });
      return { output, modelId: id };
    } catch (error) {
      controller.abort();
      if (signal?.aborted) throw new ClientAbortedError();
      failures.push(error);
      if (!isRetryableModelError(error)) throw error;
      console.warn(`[ai] ${id} failed (${describe(error)}), trying next model`);
    }
  }
  throw new AllModelsBusyError(failures);
}

type StreamArgs = Omit<Parameters<typeof streamText>[0], "model" | "maxRetries" | "providerOptions" | "onError" | "abortSignal">;

/**
 * streamText with model fallback. streamText reports errors inside the stream,
 * so we read until the first real content arrives; if an error (or nothing)
 * comes first and it is retryable, we abort that attempt and try the next model.
 */
export async function streamWithFallback(args: StreamArgs, signal?: AbortSignal) {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const failures: unknown[] = [];
  for (const id of modelChain()) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;
    const controller = new AbortController();
    const abortSignal = signal ? AbortSignal.any([controller.signal, signal]) : controller.signal;
    const result = streamText({
      ...args,
      model: google(id),
      maxRetries: 0,
      abortSignal,
      providerOptions: providerOptionsFor(id),
      onError: () => {},
    } as Parameters<typeof streamText>[0]);

    const reader = result.stream.getReader();
    const buffered: TextStreamPart<ToolSet>[] = [];
    let failed: unknown = null;

    // One timer for the whole "wait for the first chunk" phase, always cleared.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timedOut = new Promise<"timeout">((resolve) => {
      timer = setTimeout(() => resolve("timeout"), Math.min(FIRST_CHUNK_TIMEOUT_MS, remaining));
    });
    try {
      for (;;) {
        const next = await Promise.race([reader.read(), timedOut]);
        if (next === "timeout") {
          failed = Object.assign(new Error(`${id} did not start answering in time`), { name: "TimeoutError" });
          break;
        }
        const { value, done } = next;
        if (done) break;
        if (value.type === "error") {
          failed = value.error;
          break;
        }
        buffered.push(value as TextStreamPart<ToolSet>);
        if (value.type === "text-delta" || value.type === "reasoning-delta" || value.type === "finish") break;
      }
    } finally {
      clearTimeout(timer);
    }

    if (failed) {
      controller.abort();
      reader.cancel().catch(() => {});
      if (signal?.aborted) throw new ClientAbortedError();
      failures.push(failed);
      if (isRetryableModelError(failed)) {
        console.warn(`[ai] ${id} failed (${describe(failed)}), trying next model`);
        continue;
      }
      throw failed;
    }

    const stream = new ReadableStream<TextStreamPart<ToolSet>>({
      start(c) {
        for (const part of buffered) c.enqueue(part);
      },
      async pull(c) {
        const { value, done } = await reader.read();
        if (done) c.close();
        else c.enqueue(value as TextStreamPart<ToolSet>);
      },
      cancel(reason) {
        controller.abort();
        return reader.cancel(reason);
      },
    });
    return { stream, modelId: id };
  }
  throw new AllModelsBusyError(failures);
}
