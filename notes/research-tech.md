# Research — verified tech facts (agent report, 2026-10-05, condensed)

The agent verified everything below by reading installed `.d.ts` files, typechecking snippets with strict tsc, running a mocked 429 fallback test, and reading Context7 (`/websites/ai-sdk_dev`), ai.google.dev, Vercel docs and Next's bundled docs.

## Versions
`ai` 7.0.127, `@ai-sdk/google` 4.0.87, `@ai-sdk/react` 4.0.130, zod 4.6.5 (peer dependency `^3.25.76 || ^4.1.8`), Next 16.3.8, React 19.2.8, Tailwind 4.

## AI SDK v7 changes
- `instructions` replaces `system` (`system` is deprecated).
- `generateObject` / `streamObject` are deprecated. Use `generateText({ output: Output.object({ schema }) })` and read `result.output`.
- `result.toUIMessageStreamResponse()` is deprecated. Use `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`.
- `convertToModelMessages` is async.
- `useChat` setup: `new DefaultChatTransport({ api, body })`, then `sendMessage({ text }, { body })`. Status values: `submitted | streaming | ready | error`. The app manages its own input state.

## Gemini (Stable ids on ai.google.dev)
- Model ids: `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`.
- Thinking uses `thinkingLevel`: Flash 3.8/3.7 accept low|medium|high, 3.5 Flash Lite also accepts minimal, and 3.1 Lite is unknown.
- `google` reads `GOOGLE_GENERATIVE_AI_API_KEY` by default.

## Fallback on quota (no built-in model fallback in v7)
- `generateText` with `maxRetries: 0` throws `APICallError` with status 429; with retries it throws `RetryError` whose `lastError` is that error. Catch either and move to the next model.
- `streamText` does not throw; it emits an `error` part on `result.stream`. Peek at the stream until the first text delta, and if an error part arrives first, try the next model (tested with mocks).

## Vercel
- Root Directory = `web`. Set the env var in Project Settings, then redeploy.
- On Hobby with Fluid compute, functions get 300 s by default and at most.
- `x-forwarded-for` is set by Vercel (spoof-safe). An in-memory per-IP limiter is best-effort per instance, which is acceptable for a demo.
