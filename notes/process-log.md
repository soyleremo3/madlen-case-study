# Process Log (raw notes for the 1-page process document)

Format: date — tool — what for — why / decision

## 2026-10-03 (Sat)
- Claude Code (Opus) — read case PDF, researched Madlen site (madlen.io) and competitors — single place for research + build.
- Google AI Studio — created free Gemini API key in separate project `madlen-case` — isolates quota; no budget for paid key; Madlen key not yet available.
- Decision: free-tier limits are per model (Flash: 20 req/day, Flash Lite: 500 req/day) → app uses fallback chain (3.8 Flash → 3.7 Flash → 3.5 Flash Lite → 3.1 Flash Lite) so reviewers never see a quota error.
- Decision: Vercel AI SDK, one AI module → switching to another provider (e.g., Madlen's key) = change one line + env var.
- Claude Code + WebFetch → switched to in-app browser for competitor research — Khan & MagicSchool help centers blocked plain fetching (403) or hid answers in collapsed sections; browser could read them. Common Sense Media report offline → not cited.
- 2026-10-05 — Deep competitor research (Claude Code + in-app browser + DuckDuckGo HTML search): screened 6 rivals (MagicSchool, Gemini in Classroom, Khanmigo, MEBİ, Oak Aila, ChatGPT for Teachers); chose by "what a Turkish school leader actually weighs against Madlen". Used Madlen's own Insight Report for proof points.
- Decision: free tier content may be used by Google → test only with synthetic essays, never real student data. Production would need paid tier / Madlen infra (they are ISO 27001 + GDPR).
