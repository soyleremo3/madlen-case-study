import { z } from "zod";
import { curriculumSchema, gradeSchema, languageSchema } from "./options";

/** Context sent from the lesson plan, so the quiz checks exactly what was taught. */
export const quizRequestSchema = z.object({
  title: z.string().trim().min(2).max(200),
  grade: gradeSchema,
  curriculum: curriculumSchema,
  language: languageSchema,
  objectives: z.array(z.string().trim().max(400)).min(1).max(3),
  keyConcepts: z.array(z.string().trim().max(200)).max(8).default([]),
  misconceptions: z.array(z.string().trim().max(300)).max(3).default([]),
  /** Questions from earlier quizzes for this plan; the new quiz must not repeat or paraphrase them. */
  avoid: z.array(z.string().trim().max(500)).max(15).default([]),
});
export type QuizRequest = z.infer<typeof quizRequestSchema>;

export const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        kind: z.enum(["multiple_choice", "short_answer"]),
        question: z.string().describe("Clear, self-contained, age-appropriate question. Use a short real-life context where it helps."),
        options: z
          .array(z.string())
          .describe("multiple_choice: exactly 4 plausible options WITHOUT letters (no 'A)'). short_answer: empty array."),
        correctOption: z
          .number()
          .int()
          .min(-1)
          .max(3)
          .describe("multiple_choice: index 0–3 of the single correct option. short_answer: -1."),
        modelAnswer: z.string().describe("The correct answer as the teacher would accept it (for short_answer: what a full-mark answer contains)."),
        whyCorrect: z.string().describe("1 sentence for the teacher: why this is correct."),
        commonMistake: z
          .string()
          .describe(
            "1 sentence for the teacher: the tempting wrong idea and the misconception it reveals. Describe the wrong answer by its CONTENT (e.g. 'students who choose the condensation option…'); never refer to option letters or positions (options are shuffled).",
          ),
        objective: z.string().describe("Which lesson objective this question checks, in a few words."),
        difficulty: z.enum(["easy", "medium", "hard"]),
      }),
    )
    .describe("Exactly 5 questions: questions 1–3 multiple_choice, questions 4–5 short_answer, ordered from easy to hard."),
});
export type Quiz = z.infer<typeof quizSchema>;
export type QuizQuestion = Quiz["questions"][number];

export const QUIZ_LABELS = {
  en: {
    heading: "Check understanding",
    intro: "Make a 5-question quiz from this plan: 3 multiple choice and 2 short answer, each linked to an objective. The answer key is for you; the student sheet prints without answers.",
    create: "Create a 5-question quiz",
    another: "Make another quiz",
    loadingSteps: ["Reading the plan's objectives", "Writing questions from easy to hard", "Preparing the answer key"],
    showAnswers: "Show answer key",
    answer: "Answer",
    why: "Why",
    mistake: "Watch for",
    checks: "Checks",
    copyKey: "Copy with answers",
    printStudent: "Print student sheet",
    printKey: "Print answer key",
    nameLine: "Name: ____________________   Class: ______",
    answerLines: "_________________________________________________",
    difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
    keyTitle: "Answer key",
  },
  tr: {
    heading: "Anlama kontrolü",
    intro: "Bu plandan 5 soruluk bir quiz oluşturun: 3 çoktan seçmeli, 2 kısa cevaplı; her soru bir öğrenme çıktısına bağlı. Cevap anahtarı sizin için; öğrenci kâğıdı cevapsız yazdırılır.",
    create: "5 soruluk quiz oluştur",
    another: "Yeni quiz oluştur",
    loadingSteps: ["Planın öğrenme çıktıları okunuyor", "Sorular kolaydan zora yazılıyor", "Cevap anahtarı hazırlanıyor"],
    showAnswers: "Cevap anahtarını göster",
    answer: "Cevap",
    why: "Neden",
    mistake: "Dikkat",
    checks: "Ölçtüğü",
    copyKey: "Cevaplarla kopyala",
    printStudent: "Öğrenci kâğıdını yazdır",
    printKey: "Cevap anahtarını yazdır",
    nameLine: "Ad Soyad: ____________________   Sınıf: ______",
    answerLines: "_________________________________________________",
    difficulty: { easy: "Kolay", medium: "Orta", hard: "Zor" },
    keyTitle: "Cevap anahtarı",
  },
} as const;

export const LETTERS = ["A", "B", "C", "D"] as const;

export function quizToText(title: string, quiz: Quiz, lang: "en" | "tr", withAnswers: boolean): string {
  const t = QUIZ_LABELS[lang];
  const L: string[] = [title, ""];
  quiz.questions.forEach((q, i) => {
    L.push(`${i + 1}. ${q.question}`);
    if (q.kind === "multiple_choice") q.options.forEach((o, j) => L.push(`   ${LETTERS[j]}) ${o}`));
    if (withAnswers) {
      const correct = q.kind === "multiple_choice" && q.correctOption >= 0 ? `${LETTERS[q.correctOption]}) ${q.options[q.correctOption] ?? ""}` : q.modelAnswer;
      L.push(`   ${t.answer}: ${correct}`, `   ${t.why}: ${q.whyCorrect}`, `   ${t.mistake}: ${q.commonMistake}`);
    }
    L.push("");
  });
  return L.join("\n");
}
