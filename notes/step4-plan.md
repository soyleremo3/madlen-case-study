# Step 4 — Build plan: "Kalem" (3 AI mini products)

Status: draft v1 (2026-10-05). Will be updated with research agent findings (pedagogy, tech, UX).

## What the case requires (verbatim checklist)
- [ ] Build **three** tools, each fully functional for a real teacher or student
- [ ] Lesson Prep Assistant: topic + grade → objectives & key concepts, 5-slide structure (title, bullets, visual suggestion per slide), 2–3 discussion questions
- [ ] Student Chatbot: conversational UI, answers calibrated to a grade level, hints instead of direct answers for practice questions
- [ ] Essay Grader: paste essay → 3–4 criteria scores, specific inline feedback with examples, short summary the teacher can share
- [ ] Works end-to-end without errors
- [ ] Deployed on a public URL (Vercel)
- [ ] UI clean enough for a non-technical teacher/student
- [ ] 1-page process doc: AI tools used and for what, tool switches and why, what's rough and next, deliberate UI/UX decisions

## Structure
One Next.js site, three products, each with its own URL:
- `/` home: what Kalem is, three tools, note "case-study prototype for Madlen, not an official Madlen product"
- `/lesson-prep`, `/student-chat`, `/essay-grader`

## Stack
- Next.js 16 (App Router, TypeScript) + Tailwind v4, in `web/` (Vercel Root Directory = `web`)
- Vercel AI SDK v7 (`ai`, `@ai-sdk/google`, `@ai-sdk/react`) + zod 4
- Gemini free tier, one server module `src/lib/ai.ts` with model fallback chain (Flash → Flash Lite) on 429/5xx
- Structured output (schema-validated JSON) for Lesson Prep and Essay Grader; streaming chat for the Student Chatbot
- API key only on the server (`GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local` / Vercel env). Never in the browser, never in git.
- Abuse guard: per-IP rate limit + input length caps on every route

## Shared inputs (UVP carried into the product)
- Grade level (1–12)
- Curriculum: MEB Maarif (TYMM) · Cambridge · IB · General
- Output language: English · Türkçe

## Design direction
Palette fixed by the brief (Madlen-adjacent), with a meaning attached to each colour:
| Token | Hex | Role |
|---|---|---|
| paper | #faf8f5 | page background |
| cream | #fdf5ef | surfaces, inputs |
| ink | #1f2937 | text |
| iron | #70645e | secondary text |
| orange | #d37e24 | **teacher actions**: primary buttons, approve, copy |
| purple | #9078dc | **AI voice**: drafts, suggestions, margin notes |

Type: Instrument Serif for page titles and output headings (sentence case); Instrument Sans for UI and body text.

**The one memorable thing: margin notes.** AI suggestions appear like a teacher's purple pen in the margin, anchored to the exact sentence (Essay Grader inline feedback, Lesson Prep "why this works" notes). Everything else stays quiet: no gradients, no identical card grids, no all-caps labels.

Layout: tool pages use a two-column desk on desktop (inputs left, sticky; output right) and stack on mobile. Home is left-aligned: a short headline, then the three tools as rows, not a card grid.

Principles:
1. A first-time teacher can use each tool in under 30 seconds: one required field, sensible defaults, a "Try an example" button.
2. AI output is always a draft the teacher can edit, copy or print. Nothing is "final" until the teacher says so.
3. Every error says what happened and what to do next.
4. Accessible: contrast AA, visible focus, keyboard-only use, works at 375 px.

## Build order (time-boxed)
1. Shared: layout, tokens, fonts, `ai.ts` with fallback, rate limit, home page (≈45 min)
2. Essay Grader (≈75 min). Most complex UI; best showcase of "teacher in control"
3. Lesson Prep Assistant (≈60 min)
4. Student Chatbot (≈60 min)
5. Deploy to Vercel, end-to-end test on the live URL, fix (≈45 min)
6. Process document (≈30 min)
