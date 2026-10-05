# Step 5 — Social Media Post (draft)

**Case brief:** a sample Instagram or LinkedIn post that introduces **one of Madlen's core tools to teachers**, highlights its main benefit, fits the platform's style, and includes a visual idea and caption.

## Choices and why
| Choice | Decision | Reason |
|---|---|---|
| Platform | **Instagram, 5-slide carousel (1080×1350, 4:5)** | The audience is teachers. Madlen's Instagram (@madlen.io, 36.4k followers) already speaks to teachers in Turkish. Carousels are the platform's "save and share" format, which suits practical teacher content. LinkedIn suits school leaders better (the buyer audience of Step 3). |
| Tool | **Kompozisyon Değerlendirme / Essay Marking** | A core Madlen tool (madlen.io/tr/ogretmenler: upload .docx, assess structure, language and content, short feedback per student). It hits the biggest pain point: Madlen's own baseline is 10 minutes per essay by hand (Insight Report, Apr 2026). It also carries the UVP: a draft from Madlen, the final call from the teacher. |
| Main benefit | **Get your evening back without giving up the final say** | Time (teacher pain) plus control (Madlen's stance: "Madlen geri bildirim taslağını hazırlar, son kararı her zaman öğretmen verir"). |
| Language | Turkish (live audience); English version for reviewers | Same design, both rendered. |

## Visual idea (slides in `social/out/`)
Brand-matched to Madlen's Instagram: cream background, orange highlight boxes, purple accent, serif headlines, hand-drawn sparkles and hearts, and product-UI cards.

1. **Hook:** "Pazar akşamı. Masada 32 kompozisyon." A stack of essays with red-pen lines and a sticky note: "21:40 · 7/32 bitti". *Sound familiar?*
2. **Problem in numbers:** "32 × 10 dk = 5 saat 20 dk", with 32 boxes (7 filled) and a sourced footnote. "And essay #32 deserves the same care as #1."
3. **How it works:** "Madlen okur, taslağı hazırlar." UI mock: .docx upload, rubric chips (structure, language, content), per-criterion scores and a 2-sentence feedback draft. Steps: Upload, Pick a rubric, Review drafts.
4. **Teacher in control:** "Son kararı siz verirsiniz." Feedback card "Awaiting your approval" with Edit and Approve & share buttons, 3 benefits, and a responsible-AI note about the YAZEK ethics declaration (links to Step 3).
5. **CTA:** "Pazar akşamınızı geri alın." Try free at madlen.io, plus Save and Send to your department (native Instagram actions), and the Great Teachers, Great Futures sign-off.

## Caption — Turkish (to publish)
Pazar akşamı, 32 kompozisyon ve bitmeyen kırmızı kalem... Tanıdık geldi mi? ✍️

Bir kompozisyonu dikkatle okuyup geri bildirim yazmak ortalama 10 dakika sürüyor. Bir sınıf için bu, koca bir akşam demek.

Madlen'in Kompozisyon Değerlendirme aracı kompozisyonları yapı, dil ve içerik açısından okur; her öğrenci için puan önerisi ve kısa bir geri bildirim taslağı hazırlar.
Siz okur, düzenler, onaylarsınız. Son karar her zaman sizde. 🧡

✔️ Her öğrenciye aynı rubrik, aynı özen
✔️ Öğrenciyle paylaşmaya hazır geri bildirim
✔️ Kazandığınız zaman öğrencilerinize

🛡️ Öğrenci ürünlerini yapay zekâ ile değerlendirmeden önce YAZEK etik beyanınızı yapmayı unutmayın. Adım adım rehberimiz blogda.

👉 Ücretsiz denemek için bağlantı profilimizde.
📌 Kompozisyon haftası için kaydedin, zümrenizdeki öğretmen arkadaşınıza gönderin!

#Madlen #öğretmen #öğretmenlik #eğitimdeyapayzeka #yapayzeka #kompozisyon #türkçeöğretmeni #ingilizceöğretmeni #MaarifModeli #GreatTeachersGreatFutures

## Caption — English (for reviewers / UK audience)
Sunday evening, 32 essays and a red pen that never runs dry... Sound familiar? ✍️

Reading one essay carefully and writing feedback takes about 10 minutes. For a whole class, that is your entire evening.

Madlen's Essay Marking reads every essay for structure, language and content, then drafts a suggested score and short feedback for each student.
You read, edit and approve. The final call is always yours. 🧡

✔️ Same rubric, same care for every student
✔️ Feedback that is ready to share
✔️ Time back for your students

👉 Try it free, link in bio.
📌 Save this for essay week and send it to a colleague in your department!

#Madlen #TeachersOfInstagram #EdTech #AIinEducation #EssayFeedback #EnglishTeacher #GreatTeachersGreatFutures

## Platform-fit details
- First slide works as a stand-alone hook in the feed (big serif headline, one number).
- Text sized for a phone screen (headlines ≥ 96 px on 1080 px).
- Native calls to action: save, send, link in bio (Instagram does not allow links in captions).
- Alt text (accessibility): "Five-slide carousel introducing Madlen's Essay Marking tool: a stack of 32 essays on Sunday evening, the time math, the app drafting feedback, and the teacher approving it."
- Suggested timing: Sunday 18:00–20:00, right when the pain is felt.
- Success signals: saves and shares per reach (the carousel's job), profile link clicks, free sign-ups with UTM `utm_source=instagram&utm_campaign=essay_marking`.

## Files
- `social/carousel.html`: the design (one template, `?lang=tr|en&slide=1..5`)
- `social/render.sh`: renders all slides with headless Chrome
- `social/out/tr-*.png`, `social/out/en-*.png`: final images
