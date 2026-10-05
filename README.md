# Madlen Case Study: Growth Intern

Emrullah Söyler's submission for Madlen's Growth Intern case study.

**Live app:** https://kalem-case-study.vercel.app
"Kalem" is a case-study prototype, not an official Madlen product.

## What is here
| Path | Contents |
|---|---|
| `web/` | Step 4: three AI mini products in one Next.js app (Lesson prep, Study helper, Essay feedback). See [web/README.md](web/README.md). |
| `deliverables/submission/` | The submission document (Steps 1–5) as HTML; `build.cjs` prints the English and Turkish PDFs. |
| `deliverables/process-document.md` | The 1-page process document (also in Turkish: `process-document.tr.md`). |
| `deliverables/step5-instagram-carousel/` | Step 5: the 5-slide Instagram carousel, Turkish and English. |
| `notes/` | Working notes: sourced competitor research, UVP reasoning, the initiative, research summaries and a running process log. |
| `social/` | The carousel source (`carousel.html`, rendered with headless Chrome) and the Canva attempts it replaced. |

## Run the app locally
```bash
cd web
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key" > .env.local
npm run dev
```
