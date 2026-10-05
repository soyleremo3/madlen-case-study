# Step 3 — Strategic Initiative (v2)

## Madlen Ethics Desk — making the MEB AI rules the easiest part of using AI with students

**Type:** product development initiative + launch plan.

---

### Why v1 ("Zero-Edit Challenge") was dropped
v1 celebrated content "assigned without a single edit". Re-reading Madlen's own materials showed this is **off-brand and against the rules**:
- Madlen's Insight Report itself treats the 98% figure as a tension, asking whether that trust comes with AI literacy and whether teachers can question outputs.
- Madlen's promise is the opposite of "zero edits": "Madlen'in her çıktısı öğretmen kontrolünden geçiyor, hiçbir araç öğrenciye doğrudan not vermiyor" (madlen.io blog, 12 Jun 2026).
- MEB's ethics principles require human oversight: "Yapay zekâ kararlarında nihai sorumluluk insana aittir" (yazek.meb.gov.tr).
- Side-by-side "generic AI vs us" videos are also the most predictable growth idea, and Madlen itself runs on Claude, ChatGPT and Gemini, so "generic AI is worse" would be a shaky claim.

---

### The insight (evidence)
1. **New rules, binding on every school.** The MEB *Yapay Zekâ Uygulamaları Etik Kurulu Yönergesi* (22 Oct 2025) requires every school, private schools included, to form a **School AI Ethics Team** led by the principal (min. 3 members). The team oversees AI use, advises teachers and rules on violations within 15 days; a violating application is **stopped** (Madlen blog, 10 & 12 Jun 2026).
2. **A form at exactly the moment AI touches students.** Since Jan 2026, teachers must file an **Etik Beyan Formu** on YAZEK whenever AI interacts with students, processes student work (essays, even anonymised), or supports assessment and feedback. Lesson prep at home needs no form. The declaration is the teacher's responsibility and cannot be delegated to a platform (Madlen blog, 8 Jun 2026). YAZEK has had 719,090 visits (yazek.meb.gov.tr, 2026-10-05).
3. **The collision with Madlen's UVP.** Prep-only uses (where Google Gemini or ChatGPT compete for free) need no paperwork. The paperwork starts exactly where Madlen is different: the **connected loop** (assign to students, student chat, essay feedback, tracking). Every student-facing step adds a compliance task, and every separate AI tool a school uses is one more thing for the ethics team to audit.
4. **What exists today.** Madlen explains the rules well in its blog and says its infrastructure fits them (EU data, teacher control, outcome links). On its public product pages we found **no in-product support** for drafting declarations or for the ethics team's oversight work. The value is described, not yet delivered as a feature.

**Hypothesis to validate first:** the declaration step and ethics-team uncertainty slow down student-facing use at partner schools. Before building, run a 2-week check: interview 10 teachers and 5 principals at current schools, and measure the share of Madlen activity that is student-facing.

---

### What we build (MVP in one term)
1. **Declaration draft in one click (teacher side).** When a teacher assigns a student-facing activity, Madlen pre-fills a draft of the Etik Beyan Formu fields: purpose and scope, tool, a short description, the linked learning outcome, where data is stored (EU, Germany), and how each of the 8 ethics principles is met. The teacher reviews, copies it into YAZEK and submits. **The teacher stays responsible; Madlen never submits on their behalf.**
2. **Ethics Team view (principal side, inside the existing admin panel).**
   - Inventory of every student-facing AI activity: class, teacher, purpose, outcome link, declaration status.
   - Human-oversight trail: AI feedback approved by the teacher before students see it.
   - One-click summary for ethics-team meetings and for parent questions.
3. **Launch.**
   - "Set up your AI Ethics Team in one hour" webinar series for principals, built on Madlen's existing blog guides.
   - A ready-to-use ethics-team starter kit (role letter template, teacher announcement, parent FAQ).
   - The Ethics Desk becomes the headline of the 14-day school pilot.

### How it reinforces the UVP
- **"Built for your curriculum, not adapted to it"** now extends to **"built for your rules."** MEB's 2025–26 framework is local. A US-first platform or a horizontal Google layer is unlikely to build YAZEK-specific workflows soon.
- **"One connected loop"** becomes a compliance advantage: one platform gives one auditable trail, while five scattered tools mean five things to audit.
- **"School leaders see real learning progress"**: the principal, who is the buyer, gets both learning data and governance peace of mind in one panel. This answers the case's own example objective: reassure administrators.

---

### Objective
1. **Remove the friction** that keeps teachers in prep-only use, so more of them use Madlen's student-facing loop (Madlen's real differentiator).
2. **Win the buyer.** Give principals a concrete reason to choose one integrated, compliant platform over free scattered tools.
3. **Strengthen brand trust** as the responsible-AI partner of Turkish schools, consistent with Madlen's pedagogy-first, ethics-first voice.

### Success metrics
Baselines come from Madlen's data in week 0. Targets are proposed starting points, to be revised after the validation interviews.

| Goal | Metric | How measured | Proposed target (1 term) |
|---|---|---|---|
| Friction removed | Median time for a teacher to complete a declaration | Timed user tests, before vs after | –70% |
| Feature adoption | % of student-facing activities where the declaration draft is used | Product analytics | ≥ 50% |
| **Loop activation (north star)** | % of active teachers assigning ≥ 1 student-facing activity per month | Product analytics | +20% vs baseline |
| Buyer adoption | % of partner schools whose ethics team uses the panel within 30 days | Admin analytics | ≥ 60% |
| Revenue | Pilot requests from principals; pilot → paid conversion | CRM, "how did you hear" field | +25% pilots; conversion above current rate |
| Trust | Principal satisfaction / NPS for governance features | Short survey at term end | NPS ≥ 40 |
| **Guardrails** | Declarations auto-submitted by Madlen; ethics violations upheld at partner schools; AI feedback released without teacher approval | Audit logs | 0 / 0 / 0 |

### Risks and how we handle them
- **YAZEK form fields may change:** keep the drafts template-based and editable; review them each term.
- **Over-promising compliance:** copy says "helps you prepare", never "guarantees compliance". Responsibility stays with the teacher and the school, as the guideline requires.
- **The friction may turn out to be small:** the 2-week validation runs first. If the data says no, keep the Ethics Team view (buyer value) and drop the teacher draft.

### Links to other steps
- Step 4 products follow the same principle: the Essay Grader is a **teacher-facing draft** (the teacher edits and approves before sharing), and the Student Chatbot gives **hints, not answers**. The teacher is always in control.
- Step 5 social post can introduce one core tool in the same teacher-in-control voice.
