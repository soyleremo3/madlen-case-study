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
 * when one is out of quota. Override with KALEM_MODELS="id1,id2" (e.g. use only
 * Flash Lite while developing, to keep the Flash quota for reviewers).
 */
const DEFAULT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

export function modelChain(): string[] {
  const fromEnv = process.env.KALEM_MODELS?.split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_MODELS;
}

/** Keep latency low; thinking level names differ per model family. */
function providerOptionsFor(modelId: string) {
  const google: GoogleLanguageModelOptions = {
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
    ],
  };
  if (/^gemini-3\.(8|7|6)-flash$/.test(modelId)) google.thinkingConfig = { thinkingLevel: "low" };
  if (modelId === "gemini-3.5-flash-lite") google.thinkingConfig = { thinkingLevel: "minimal" };
  return { google };
}

/** True when the error means "try another model" (quota, overload, transient). */
export function isRetryableModelError(error: unknown): boolean {
  const e = RetryError.isInstance(error) ? error.lastError : error;
  if (!APICallError.isInstance(e)) return false;
  return e.statusCode === 429 || e.statusCode === 503 || e.statusCode === 500 || e.isRetryable;
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
        providerOptions: providerOptionsFor(id),
      } as Parameters<typeof generateText>[0]);
      return { result, modelId: id };
    } catch (error) {
      lastError = error;
      if (!isRetryableModelError(error)) throw error;
      console.warn(`[ai] ${id} unavailable, trying next model`);
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

    for (;;) {
      const { value, done } = await reader.read();
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
        console.warn(`[ai] ${id} unavailable, trying next model`);
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
