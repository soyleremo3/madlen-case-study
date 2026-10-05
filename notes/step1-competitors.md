# Step 1 — Competitive Analysis (v2, deep research)

Researched 2026-10-03 and 2026-10-05. Every claim has a source. "Not found" = we looked and found nothing; we do not claim it does not exist.

---

## 0. Madlen baseline (what we compare against)

| Fact | Source |
|---|---|
| 18,566 teachers used Madlen Oct 2024 – Apr 2026; 308,062 hours saved; 425,669 questions generated | madlen.io/tr/blog/egitimde-yapay-zeka-308000-saat-... (Madlen Insight Report, 21 Apr 2026) |
| 98.08% of generated+assigned questions (233,702 / 238,281) assigned to students without a single edit | same report |
| Usage peaks 10:00–15:00 → teachers use it *in school*, between lessons | same report |
| "150+ K12 kampüsünde aktif olarak kullanılıyor" | madlen.io/tr/okullar-icin |
| Teacher tools (50+ "Araç Kutusu"), student app (assignments, practice exams, question solver, live tutor, AstroLearn), admin panel, weekly parent report | madlen.io, /okullar-icin, /faq |
| Output of one tool can be taken into another tool and re-levelled ("Bir aracın çıktısını alıp başka bir araçta geliştirebilir") | madlen.io/tr/faq |
| MEB learning-outcome mapping mode ("öğrenim çıktısı eşleştirme modu"), MEB Maarif (TYMM) aligned; LGS/TYT/AYT; IB PYP/MYP/DP, AP, Cambridge IGCSE/A-Level | madlen.io/tr/faq, blog (TYMM guides, May 2026) |
| Integrations: Google Workspace for Education, Microsoft 365, K12NET; SSO | madlen.io/tr/faq |
| Data: KVKK + GDPR; runs on Infercom, servers in Germany, "ABD'ye aktarılmıyor"; ISO 27001:2022 belongs to Infercom infrastructure (not Madlen itself) | madlen.io/tr/faq, homepage footnote |
| Uses Claude, ChatGPT, Gemini behind a pedagogical/safety filter layer | madlen.io/tr/faq |
| Pricing: paid, institution-specific; teacher basic assistant tools free to try; 14-day free school pilot | madlen.io/tr/faq |
| Brighteye Ventures Founder Studio (May 2026) | madlen.io blog |

**Madlen's honest weaknesses:** paid with no public price; much smaller brand and scale than global rivals; 50+ tools risks the same "tool menu" perception the case itself flags ("users may not instantly grasp this integrated value").

---

## 1. Landscape — 6 candidates screened

| Competitor | Who / scale | Price | Teacher tools | Student side | Turkish curriculum (MEB/LGS/YKS) | Threat to Madlen in TR |
|---|---|---|---|---|---|---|
| **MagicSchool AI** | US startup, $45M Series B (Feb 2025), 6M+ educators, 10,000+ schools, 160 countries | Free / Plus $8.33/mo / Enterprise | 80+ | 50+ student tools | Not found; US standards databases; no Turkish UI | High (global benchmark, same pitch) |
| **Google Gemini in Classroom** | Google, inside Workspace for Education | Free in all Edu editions (since Jun 2025) | 30+ | Gems, Gemini Notebook, class analytics | Not found | **Very high** (free + already installed) |
| **Khanmigo** | Khan Academy (nonprofit), Microsoft-backed | Teacher tools free (almost every country); student tutor paid, US-only | 25+ | US only | Not found; Turkish not fully quality-tested | Medium |
| **MEBİ** | Ministry of Education (state) | Free | No content-creation tools found | Exam prep, 5.676M users in 2025-26 | Yes (LGS/YKS, past papers) | Medium — student exam-prep side only |
| **Oak Aila** | Oak National Academy (UK, public) | Free | Lesson + resources | — | No (England curriculum) | Low in TR, relevant in UK |
| **ChatGPT for Teachers** | OpenAI | Free for verified US K-12 only | General | — | No | Low directly; generic ChatGPT is the "default alternative" |

### Why we pick MagicSchool + Google Gemini in Classroom
They are the two real alternatives a Turkish school leader weighs against Madlen:
1. **MagicSchool** = "the specialist global AI-for-teachers platform" (same promise as Madlen, bigger).
2. **Gemini in Classroom** = "the free AI already inside our Google Workspace" (good-enough + zero cost). Madlen even integrates with Google Workspace, so this rival sits in the same schools.
Khanmigo, MEBİ, Aila, ChatGPT → shown in the landscape table as "also considered" (shows depth without diluting).

---

## 2. Evidence per competitor

### MagicSchool AI
- $45M Series B, 11 Feb 2025, led by Valor Equity Partners (+ Bain Capital Ventures, Adobe Ventures); "over 6 million educators", "more than 10,000 schools", "160 countries" — magicschool.ai/blog-posts/series-b-fundraise-for-teacher-ai
- 80+ teacher tools, 50+ student tools, assistant Raina; tagline "safe, district-aligned AI"; claims "7-10 hours time saved per week" — magicschool.ai
- Free ($0 forever), Plus $8.33/mo annual ($12.99 monthly), Enterprise custom — magicschool.ai/pricing
- SOC 2, FERPA/COPPA; "We don't use student or teacher data to train AI" — magicschool.ai
- Standards pulled from "Common Standards Project and the 1EdTech CASE Network", refreshed weekly; "state and national standards" — help.magicschool.ai/en/articles/12454976
- District document/curriculum upload = Enterprise — magicschool.ai/pricing
- Interface: 24 languages, Turkish not among them — help.magicschool.ai/en/articles/10604047
- Translation via LLMs into 98 languages; "there may be occasional errors" — help.magicschool.ai
- Independent review (Educators Technology, Feb 2026): "performance issues, particularly during peak usage hours"; structured templates "can feel limiting"; Text Leveler "does not always nail the target grade level"; free tier has no direct export to Google Docs/Word/LMS — educatorstechnology.com/2026/02/magicschool-ai-review.html

### Google Gemini in Classroom
- Announced 30 Jun 2025: free for all Google Workspace for Education accounts, "more than 30 new features"; NotebookLM + Gems for students; standards tagging, Class Analytics, insights on students needing support — blog.google/.../classroom-ai-features/
- Workspace update: previously only with paid Gemini Education add-ons; now all Edu editions — workspaceupdates.googleblog.com/2025/06/gemini-google-classroom-all-edu-editions.html
- Tools: lesson outline, hook, quiz, re-level text, vocabulary, rubric, "Tackle common misconceptions", choice board, audio lesson; student Gemini tab (quiz me, flashcards, study guide), Gemini Notebook — support.google.com/edu/classroom/answer/15410566
- Disclaimer: "Gemini can make mistakes. Always double-check responses for accuracy"; teachers should "check and refine the output so that it fits your context and local policies before assigning to students" — same page
- Admins manage access per edition — knowledge.workspace.google.com (Manage access to Gemini in Classroom)
- MEB/TYMM, LGS/YKS alignment: not found

### Khanmigo (alternative #2 if preferred)
- Teacher tools free in "nearly every country" (excluded: Cuba, Iran, N. Korea, Syria, occupied Ukrainian regions); "paid Khanmigo subscriptions are only available in the United States" — support.khanacademy.org/hc/en-us/articles/28467553186317
- Turkish supported; "Only English, Hindi, Spanish, and Portuguese have been fully quality-tested" — support.khanacademy.org/hc/en-us/articles/41626114291469
- Powered by Azure OpenAI via Microsoft partnership — microsoft.com education blog (Aug 2024)
- RCT, 18 Tennessee middle schools (U. Toronto, NBER draft Aug 2026): "Access was nearly universal but engagement was thin"; used ~1/3 of days; gains attributed to Khan content, not the AI — chalkbeat.org 2026/08/25
- Khan Academy response: students used Khanmigo "infrequently"; Sal Khan: "The AI could not just sit next to the content. It had to be woven into it." — blog.khanacademy.org, chalkbeat

### MEBİ
- Free, MEB Ortaöğretim GM; LGS/YKS prep + school subjects; AI assistant "KANKA"; past 8 years' exam questions with video solutions; students, graduates, teachers, parents — mebi.eba.gov.tr
- 5,676,000 users logged in during 2025-26; 7M+ practice exams — meb.gov.tr news 41439 (Jul 2026), AA

### Context (useful for Step 2-3)
- MEB "Eğitimde Yapay Zekâ Politika Belgesi ve Eylem Planı (2025–2029)" in force 15 Feb 2026 — yzizleme.meb.gov.tr
- YAZEK: MEB ethics declaration system for teachers/developers using AI apps — yazek.meb.gov.tr
- Could not verify: Common Sense Media AI teacher-assistant risk report (page offline) — not cited.

---

## 3. Draft paragraphs for submission (English)

**MagicSchool AI — the global specialist.** MagicSchool is the category leader and Madlen's closest product analogue: after a $45M Series B (Feb 2025) it reports 6M+ educators across 160 countries, offering 80+ teacher tools, 50+ student tools and district dashboards. Its strengths are reach and trust — a free-forever plan (Plus from $8.33/month), SOC 2/FERPA/COPPA compliance, a public pledge not to train AI on teacher or student data, and standards pulled from live databases rather than model memory. Its weaknesses are the price of that scale. Independent reviews cite slow loading at peak hours, template-bound tools and levelled texts that miss the target grade, and no export to Docs, Word or the LMS on the free plan; 80+ single-purpose generators feel like a menu, not a workflow. It is also US-first: standards come from US databases, the interface has no Turkish, Turkish output relies on machine translation MagicSchool itself says may contain errors, and nothing maps to MEB Maarif outcomes or LGS/YKS formats.

**Google Gemini in Classroom — the free default.** Since June 2025 Google has given every Google Workspace for Education account 30+ free AI tools (lesson outlines, quizzes, rubrics, re-levelled texts, misconception support), student-facing Gems and Gemini Notebook study guides, and class analytics — inside the Classroom many Turkish private schools already use daily. Its strengths are zero cost, zero onboarding and Google's brand. Its weakness is that it is a horizontal AI layer, not a teaching system: Google itself warns that "Gemini can make mistakes" and asks teachers to refine every output to fit "your context and local policies" — so the localisation work stays with the teacher. We found no published alignment to MEB Maarif learning outcomes, LGS/YKS item formats or IB/Cambridge programmes; it only reaches schools on Google Workspace (not Microsoft 365 or K12NET), and access depends on the school's IT admin.

**(Alternative) Khanmigo — the trusted brand.** Khanmigo carries the most trusted name in online learning and a principled Socratic tutor, and its 25+ teacher tools are free in almost every country, including Türkiye. But outside the US the experience is split: paid subscriptions — the student tutor — are US-only, and Turkish is supported but not among the four fully quality-tested languages. A two-year randomised trial in 18 Tennessee schools (Aug 2026) found engagement "thin": students opened the tutor on about a third of days, and gains came from Khan's content rather than the AI. Sal Khan's own conclusion — the AI "had to be woven into" the content — is exactly the integration argument Madlen makes.

---

## 4. What this tells us (input for Step 2 — UVP)
- Madlen cannot win on **price** (Google, Khanmigo, MEBİ free; MagicSchool free tier) or **tool count** (MagicSchool 80+).
- Madlen wins on two things rivals structurally lack:
  1. **Local-first pedagogy**: MEB Maarif (TYMM) learning-outcome mapping, LGS/TYT/AYT, Turkish-native, plus IB/Cambridge for international schools; KVKK + EU-hosted data.
  2. **One connected loop**: plan → create → assign → mark → track → report to parents/admin, teacher + student + admin in one system. Evidence it matters: Khanmigo trial (AI "beside" content goes unused) vs Madlen's 98% of questions assigned unedited and in-school usage peaks.
- Proof points to reuse: 18,566 teachers, 150+ K12 campuses, 308,062 hours saved, 98% assigned unedited.
