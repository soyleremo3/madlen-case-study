# Process document

Live app: kalem-case-study.vercel.app
Code: github.com/soyleremo3/madlen-case-study
I called the prototype "Kalem" so it would not be mistaken for an official Madlen product.

## Which AI tools did I use, and for what?
I built almost everything with Claude Code (Claude Opus). I used it to research Madlen and its competitors, plan the work, write the Next.js code, write and test the prompts, and check the results. For bigger questions I ran separate Claude agents in parallel. One covered teaching research (hint ladders, MEB rubric levels), one checked the AI SDK documentation, and one compared the UX of MagicSchool, Brisk and Khanmigo. A final agent reviewed the finished code. The app itself runs on Google's Gemini API (free tier). I also tried Canva AI for the Instagram post.

## Where did I switch tools, and why?
- Canva AI to code. Canva returned single-page designs, replaced my Turkish text with English filler and printed a wrong formula. I built the carousel in HTML/CSS instead and exported it with Chrome.
- Plain web requests to a real browser. The Khanmigo and MagicSchool help centres blocked automated requests, so I read them in a browser.
- Gemini Flash to Flash Lite. On test day Flash returned "high demand" errors, and it only allows 20 free requests a day. Flash Lite now runs first and Flash is the backup.

## What is still rough, and what would I fix next?
- The free API tier allows about 500 requests a day, and Google may use free-tier data. Because of that I only tested with made-up essays. A real version would run on Madlen's EU-hosted infrastructure.
- The small model sometimes misses a grammar slip or gives similar scores across criteria. I added a proofreading step and scoring rules. Next I would test it against essays that teachers have already marked.
- There are no accounts and nothing is saved. Next would be saving plans and sending a quiz straight to a class.
- The tools use Maarif terminology but are not mapped to real learning-outcome codes. That needs Madlen's curriculum data.

## What UI/UX decisions did I make, and why?
- The teacher stays in control. Lesson plans, quizzes and essay feedback are labelled as AI drafts, and every score and note can be edited. Essay feedback can only be copied after the teacher approves it. This follows Madlen's own position and MEB's human-oversight rule.
- Each colour has one meaning. Orange is for the teacher's actions and purple is for the AI's suggestions. Essay notes sit next to the sentence they refer to, like comments in the margin.
- First use takes seconds. Only topic and grade are required, and each tool has examples to try.
- The Study helper is built for learning. On practice problems it gives hints before the answer. On writing tasks it gives an outline instead of a finished essay. If a student mentions self-harm, it gives a fixed reply that points them to a trusted adult.
- It fits Turkish classrooms. The interface works in Turkish and English, and grades are grouped as İlkokul, Ortaokul and Lise. Error messages say what to do next.
