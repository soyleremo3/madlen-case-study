# Kalem: AI mini tools for teachers and students

A case-study prototype for Madlen's Growth Intern application. It is not an official Madlen product.

| Tool | Route | What it does |
|---|---|---|
| Lesson prep | `/lesson-prep` | Topic + grade → 1–2 Bloom-level objectives with "I can" criteria, key concepts, a timed flow with checks for understanding, 5 slides with a visual idea each, discussion questions, misconceptions, exit ticket |
| Study helper | `/student-chat` | Grade-calibrated chat for students; practice problems get a 4-step hint ladder instead of the answer; crisis responder and safety rules for minors |
| Essay feedback | `/essay-grader` | 4-criterion analytic rubric (MEB-style levels), margin notes anchored to exact quotes with example rewrites, editable scores; the teacher approves before copy/print |

Shared options: grade 1–12, curriculum (MEB Maarif, Cambridge, IB, General), output language (English / Türkçe).

## Stack
- Next.js 16 (App Router), Tailwind CSS v4, Vercel AI SDK v7, zod 4
- Google Gemini free tier via `@ai-sdk/google`, with model fallback (`src/lib/ai.ts`). Flash Lite runs first (fast and reliable on the free tier), and Flash models are kept as a fallback.
- Structured output (`Output.object`) for lesson plans and essay feedback; streaming for chat.

## Run locally
```bash
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key" > .env.local
npm run dev
```
Optional: set `KALEM_MODELS=model-a,model-b` to override the model order.

## Notes
- The API key lives only on the server. Every route has input validation, length caps and a best-effort per-IP rate limit.
- Nothing is stored. Don't enter students' names or personal details.
