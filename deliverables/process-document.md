# Kalem: process document

**Live app:** kalem-case-study.vercel.app · **Code:** github.com/soyleremo3/madlen-case-study
Three tools in one site: Lesson prep, Study helper and Essay feedback. It is named "Kalem" and labelled as a case-study prototype, so it is never mistaken for an official Madlen product.

## AI tools: what I used and for what
- **Claude Code (Claude Opus)** was my main build partner. I used it to research Madlen and competitors in a built-in browser, plan, write all the code (Next.js 16, Vercel AI SDK, Tailwind), design and iterate prompts, and write test scripts.
- **Claude sub-agents** did focused jobs in parallel. Before building, three research agents covered pedagogy (hint ladders, MEB rubric levels, backward design), tech (they verified the new AI SDK v7 API against Context7 docs and typechecked snippets) and a UX benchmark of MagicSchool, Brisk, Khanmigo and Madlen. Before deploying, an independent read-only review agent audited the code.
- **Google Gemini API (free tier)** powers the app. I use Flash Lite models through one server module with a fallback chain, so switching to Madlen's own provider means changing one line.
- **Canva AI** was tried for the Instagram carousel (see below).

## Where I switched tools, and why
- **Web fetching → built-in browser.** Help centres (Khanmigo, MagicSchool) blocked plain fetching or hid answers in collapsed sections. A real browser could read them.
- **Canva AI → code-rendered carousel.** Canva returned single-page designs, dropped the mascot, replaced my Turkish copy with English filler and printed a wrong formula. HTML/CSS rendered by headless Chrome gave exact copy, real brand assets and 5 slides.
- **Gemini Flash → Flash Lite first.** On test day Flash returned "503 high demand" and has only 20 free requests a day. Lite models come first now, with a 25 s timeout per model and a 50 s total budget.

## What is still rough, and what I would fix next
- **Free-tier limits:** about 500 requests a day. Google may use free-tier data, so I tested only with synthetic essays. Next: Madlen's EU-hosted, KVKK-compliant infrastructure.
- **Model quality:** small models sometimes miss grammar slips or repeat a score. I added a proofreading pass before scoring and a full-range scoring rule, and the teacher always reviews. Next: a calibration set of marked essays.
- **No accounts or saving yet.** Plans and feedback live in the browser session. Next: saving, plus sending a quiz straight to a class. That is Madlen's "connected loop".
- **Curriculum depth:** the tools use MEB Maarif terminology but never invent outcome codes. Next: real outcome mapping from Madlen's database.

## Deliberate UI/UX decisions
- **The teacher is always in control.** Every teacher-facing AI output (lesson plan, quiz, essay feedback) carries an "AI draft" badge. Essay feedback can be copied or printed only after "Approve feedback", and every score and note is editable. This mirrors Madlen's own stance and the MEB human-oversight rule.
- **Colour has meaning.** Orange marks teacher actions and purple marks the AI's voice, like a second pen in the margin. Essay notes sit next to the exact sentence they refer to. The colours are close to Madlen's brand; orange text uses a darker shade to pass WCAG AA contrast.
- **Fast first use.** Only topic and grade are required, with example chips and a "Try a sample essay" button. Loading shows named steps instead of a bare spinner.
- **Learning over answers.** The Study helper uses a 4-step hint ladder for practice questions, gives an outline instead of a ready-made essay for writing tasks, and replies with a fixed message pointing to a trusted adult and 112 if a student writes about self-harm.
- **Turkish-first and built for real use.** There is a TR/EN interface and grades are grouped by İlkokul, Ortaokul and Lise. Errors say what to do next ("daily limit reached, resets at 10:00"). It works at phone width and with a keyboard only.
