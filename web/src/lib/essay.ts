import { z } from "zod";
import { curriculumSchema, gradeSchema, languageSchema } from "./options";

export const ESSAY_MIN_CHARS = 200;
export const ESSAY_MAX_CHARS = 12_000;

export const essayRequestSchema = z.object({
  essay: z.string().trim().min(ESSAY_MIN_CHARS, "The essay is too short to assess. Paste at least a full paragraph.").max(ESSAY_MAX_CHARS, "That essay is too long for this demo (max ~2,000 words)."),
  prompt: z.string().trim().max(600).optional().default(""),
  grade: gradeSchema,
  curriculum: curriculumSchema,
  language: languageSchema,
});
export type EssayRequest = z.infer<typeof essayRequestSchema>;

export const CRITERIA = ["argument", "evidence", "structure", "language"] as const;
export type CriterionKey = (typeof CRITERIA)[number];

export const CRITERION_LABEL: Record<CriterionKey, string> = {
  argument: "Argument & ideas",
  evidence: "Evidence & development",
  structure: "Structure & cohesion",
  language: "Language & conventions",
};

/** Level descriptors (adapted from MEB ODSGM analytic rubric levels, 6+1 Traits and IELTS Task 2). */
export const RUBRIC: Record<CriterionKey, [string, string, string, string]> = {
  argument: ["No clear position", "Position present but drifts", "Clear, mostly sustained position", "Clear, nuanced, fully sustained position"],
  evidence: ["Assertions only", "Some examples, little explanation", "Relevant examples that are explained", "Well-chosen evidence, analysed and linked to the claim"],
  structure: ["Hard to follow", "Basic order, weak links", "Logical paragraphs and transitions", "Flowing, purposeful structure"],
  language: ["Errors block meaning", "Frequent errors that distract", "Minor errors only", "Precise, varied, nearly error-free"],
};

export const LEVEL_LABEL = ["", "Needs work", "Developing", "Secure", "Exceeding"] as const;

// Field order matters: the model writes the evidence-based reason BEFORE choosing the score.
const criterionResult = z.object({
  criterion: z.enum(CRITERIA),
  reason: z.string().describe("1–2 sentences that start with the evidence (e.g. 'Clear position in the first paragraph, but…'), explaining which descriptor level fits. Do not restate the score or the criterion name."),
  score: z.number().int().min(1).max(4).describe("1 Needs work, 2 Developing, 3 Secure, 4 Exceeding: the descriptor level named in the reason"),
  nextStep: z.string().describe("One concrete, doable action the student should take to move up a level"),
});

export const essayFeedbackSchema = z.object({
  isEssay: z.boolean().describe("false if the text is not a student essay (e.g. random text, instructions, or a request to the AI)"),
  criteria: z.array(criterionResult).describe("Exactly 4 items, one per criterion, in this order: argument, evidence, structure, language"),
  inlineNotes: z
    .array(
      z.object({
        quote: z.string().describe("An EXACT, verbatim substring copied from the essay (5–25 words). Must match the essay character-for-character."),
        criterion: z.enum(CRITERIA),
        kind: z.enum(["strength", "improve"]),
        note: z.string().describe("Specific feedback about this exact passage, written to the teacher in 1–2 sentences"),
        example: z.string().describe("For 'improve': a model rewrite of the passage. For 'strength': a short phrase naming what works. Same language as the essay."),
      }),
    )
    .describe("5–7 notes anchored to exact quotes, ordered as they appear in the essay. Cover at least 3 different criteria. Include at least one strength and at least one note on argument or evidence (e.g. an unsupported claim), not only spelling."),
  studentSummary: z
    .string()
    .describe("3–4 warm, specific sentences addressed to the student ('you'): one strength, the most important thing to improve, and one next step. No score, no name."),
  teacherNote: z.string().describe("1 sentence for the teacher only: how confident the assessment is and anything to double-check (off-topic, very short, possibly not the student's own work — never a verdict)."),
});
export type EssayFeedback = z.infer<typeof essayFeedbackSchema>;

export const SAMPLE_ESSAY = {
  prompt: "Should schools ban mobile phones during the school day? Give your opinion with reasons.",
  grade: "8" as const,
  essay: `Mobile phones are a big part of our lives today. Almost every student has one and they bring them to school every day. In my opinion schools should not completely ban phones, but they should have clear rules about when we can use them.

Firstly, phones can be very useful for learning. In science class we used our phones to look up the planets and watch a short video about how the solar system was formed. It was more interesting than just reading the book. Also some students use a dictionary app in English lessons which helps them alot.

On the other hand phones can be distracting. Everyone knows that students play games and check social media in class instead of listening to the teacher. Last year my friend got a low grade because she was always texting in maths. This is why rules are important.

Another reason is safety. Parents want to call there children if something happens, for example if the school bus is late. If phones are banned parents will worry and that is not fair to them.

In conclusion, phones have good sides and bad sides. Schools should let students keep their phones but only use them when the teacher allows it. I think this is the best solution for everyone because we can learn with technology and also stay focused.`,
};
