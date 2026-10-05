# Process document

Live app: kalem-case-study.vercel.app
Code: github.com/soyleremo3/madlen-case-study
I called the prototype "Kalem" so it would not be mistaken for an official Madlen product.

## Which AI tools did I use, and for what?
I built almost everything with Claude Code (Claude Opus). I used it to research Madlen and its competitors, plan the work, write the Next.js code, write and test the prompts, and check the results. For bigger questions I ran separate Claude agents in parallel: one on teaching research (hint ladders, MEB rubric levels), one on the AI SDK documentation, and one comparing the UX of MagicSchool, Brisk and Khanmigo. A last agent reviewed the finished code. The app itself runs on Google's Gemini API.

## Where did I switch tools, and why?
I tried Canva AI first for the Instagram post. It returned single-page designs, replaced my Turkish text with English filler and printed a wrong formula, so I built the slides in HTML/CSS and exported them with Chrome. In the app I started with Gemini Flash, but on test day it returned "high demand" errors, and its free tier allows only 20 requests a day. Flash Lite now runs first, with Flash as the backup.

## What UI/UX decisions did I make, and why?
The teacher decides what students see. Lesson plans, quizzes and essay feedback are labelled as AI drafts, every score and note can be edited, and essay feedback can only be copied after the teacher approves it. Madlen works the same way, and MEB requires human oversight of AI.
Orange marks the teacher's actions and purple marks the AI's suggestions. Essay notes sit next to the sentence they refer to, like comments in the margin.
Only the topic and grade are required, and each tool has examples to try, so a first-time user gets a result in under a minute.
The Study helper is meant to make students think. On practice problems it gives hints before the answer, and on writing tasks it gives an outline. If a student mentions self-harm, it replies with a fixed message that points them to a trusted adult.
The interface works in Turkish and English, grades are grouped as İlkokul, Ortaokul and Lise, and error messages say what to do next.
