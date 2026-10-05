import "server-only";
import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import {
  APICallError,
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

/** Give up on one model after this long and try the next one. */
const ATTEMPT_TIMEOUT_MS = 25_000;

export function modelChain(): string[] {
  const fromEnv = process.env.KALEM_MODELS?.split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_MODELS;
}

/** Keep latency low; thinking level names differ per model family. */
function providerOptionsFor(modelId: string) {
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
  if (/^gemini-3\.(8|7|6)-flash$/.test(modelId)) google.thinkingConfig = { thinkingLevel: "low" };
  if (modelId === "gemini-3.5-flash-lite") google.thinkingConfig = { thinkingLevel: "minimal" };
  return { google };
}

/** True when the error means "try another model" (quota, overload, transient). */
export function isRetryableModelError(error: unknown): boolean {
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return true;
  if (!APICallError.isInstance(e)) return false;
  return e.statusCode === 429 || e.statusCode === 503 || e.statusCode === 500 || e.isRetryable;
}

function describe(error: unknown): string {
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (APICallError.isInstance(e)) return `HTTP ${e.statusCode ?? "?"}: ${e.message.slice(0, 160)}`;
  return error instanceof Error ? error.message.slice(0, 160) : String(error).slice(0, 160);
}

export class AllModelsBusyError extends Error {
  constructor(cause: unknown) {
    super("All AI models are busy or out of quota right now.");
    this.name = "AllModelsBusyError";
    this.cause = cause;
  }
}

type GenerateArgs = Omit<Parameters<typeof generateText>[0], "model" | "maxRetries" | "providerOptions">;

/** generateText with model fallback. Use with `output: Output.object(...)` for JSON. */
export async function generateWithFallback(args: GenerateArgs) {
  let lastError: unknown;
  for (const id of modelChain()) {
    try {
      const result = await generateText({
        ...args,
        model: google(id),
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        providerOptions: providerOptionsFor(id),
      } as Parameters<typeof generateText>[0]);
      return { result, modelId: id };
    } catch (error) {
      lastError = error;
      if (!isRetryableModelError(error)) throw error;
      console.warn(`[ai] ${id} unavailable (${describe(lastError)}), trying next model`);
    }
  }
  throw new AllModelsBusyError(lastError);
}

type StreamArgs = Omit<Parameters<typeof streamText>[0], "model" | "maxRetries" | "providerOptions" | "onError">;

/**
 * streamText with model fallback. streamText reports errors inside the stream,
 * so we read until the first real content arrives; if an error comes first and
 * it is a quota/overload error, we try the next model.
 */
export async function streamWithFallback(args: StreamArgs) {
  let lastError: unknown;
  for (const id of modelChain()) {
    const result = streamText({
      ...args,
      model: google(id),
      maxRetries: 0,
      providerOptions: providerOptionsFor(id),
      onError: () => {},
    } as Parameters<typeof streamText>[0]);

    const reader = result.stream.getReader();
    const buffered: TextStreamPart<ToolSet>[] = [];
    let failed: unknown = null;

    const firstChunkDeadline = Date.now() + 20_000;
    for (;;) {
      const remaining = firstChunkDeadline - Date.now();
      const next = await Promise.race([
        reader.read(),
        new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), Math.max(remaining, 0))),
      ]);
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

    if (failed) {
      lastError = failed;
      reader.cancel().catch(() => {});
      if (isRetryableModelError(failed)) {
        console.warn(`[ai] ${id} unavailable (${describe(lastError)}), trying next model`);
        continue;
      }
      throw failed;
    }

    const stream = new ReadableStream<TextStreamPart<ToolSet>>({
      start(controller) {
        for (const part of buffered) controller.enqueue(part);
      },
      async pull(controller) {
        const { value, done } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value as TextStreamPart<ToolSet>);
      },
      cancel(reason) {
        return reader.cancel(reason);
      },
    });
    return { stream, modelId: id };
  }
  throw new AllModelsBusyError(lastError);
}
