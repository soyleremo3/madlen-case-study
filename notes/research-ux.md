# Research — UX benchmark (agent report, 2026-10-05, condensed)

Sources: public help centers and product pages of MagicSchool, Khanmigo, Brisk, Gemini in Classroom, Oak Aila, Madlen. Reddit, G2 and Khan support blocked automated access, so those gaps were not filled.

## Key findings
- **Madlen's own essay marking** (madlen.io/tr/okullar-icin): total score 52/70 plus four weighted criteria, a "Genel Özet", and a reason and suggestion per criterion, with 1–4 rubric levels. Stance: "Madlen geri bildirim taslağını hazırlar, son kararı her zaman öğretmen verir". Its mockups show **no explicit approval step**, which is a gap our tool fills.
- **Madlen's "Maarif Günlük Ders Planı"**: "Öğrenme Çıktıları", then timed segments (Isınma 5 dk, Anlatım 7, Rehberli Uygulama 6, Bağımsız Uygulama 4, Değerlendirme 3, Kapanış 2), then "Ek Düzenlemeler".
- **Brisk**: feedback stays as draft Google Doc comments until the teacher approves. Feedback types: Glow & Grow, Next Steps, Rubric, Targeted.
- **MagicSchool**:
  - Class Writing Feedback has to be approved before download.
  - Exports are paywalled; free users only get Copy.
  - Student rooms cap at about 50 messages and include AI disclosure reminders.
- **Aila** keeps teachers "in the driving seat" and says "generative AI will make mistakes".
- **Complaints across the market**: generic, recall-level output (UMass study: 90% of activities basic-level thinking) and novice teachers over-trusting AI.

## Patterns we adopt
1. A Draft chip, plus explicit "Approve & share" before anything reaches students.
2. Timed lesson segments that add up to the lesson length.
3. Only the essentials are required (topic, grade); everything else sits under "More options".
4. Example chips and a "Try a sample essay" button.
5. Named loading steps instead of a bare spinner.
6. Copy, Print and PDF available to everyone (no paywalled export).
7. Student chat: AI disclosure, hint ladder, a Stop button while streaming, and a "talk to your teacher" nudge.
8. An inline notice not to enter student names.

## Accessibility (computed contrast)
- Orange #d37e24 on cream: 2.87:1. White on orange: 3.10:1. Both **fail** for text.
- So buttons and orange text use #a85d16 (white text 4.9:1), and purple text uses #5f48c2.
- Score levels show numbers and labels, never colour alone.
- Enter sends and Shift+Enter adds a new line. Streamed text uses aria-live. Tap targets ≥ 44 px. Works at 375 px.
