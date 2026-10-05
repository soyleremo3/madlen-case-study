import { z } from "zod";
import { curriculumSchema, gradeSchema, languageSchema } from "./options";

export const DURATIONS = ["30", "40", "45", "60", "80"] as const;

export const lessonRequestSchema = z.object({
  topic: z.string().trim().min(3, "Tell us the topic (at least a few words).").max(200, "Keep the topic under 200 characters."),
  subject: z.string().trim().max(60).optional().default(""),
  grade: gradeSchema,
  duration: z.enum(DURATIONS),
  curriculum: curriculumSchema,
  language: languageSchema,
  notes: z.string().trim().max(400).optional().default(""),
});
export type LessonRequest = z.infer<typeof lessonRequestSchema>;

export const BLOOM = ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"] as const;
export type Bloom = (typeof BLOOM)[number];

/** Bloom level names as Turkish teachers know them (revised taxonomy). */
export const BLOOM_TR: Record<Bloom, string> = {
  Remember: "Hatırlama",
  Understand: "Anlama",
  Apply: "Uygulama",
  Analyse: "Analiz",
  Evaluate: "Değerlendirme",
  Create: "Yaratma",
};

export const lessonPlanSchema = z.object({
  isAppropriate: z.boolean().describe("false if the topic is not a legitimate school topic for this age (e.g. harmful or adult content)"),
  title: z.string().describe("Short, engaging lesson title"),
  bigIdea: z.string().describe("One sentence: the enduring understanding students should leave with"),
  objectives: z
    .array(
      z.object({
        text: z.string().describe("Measurable objective starting with an observable action verb, e.g. 'Explain how…' (never 'understand' or 'know')"),
        level: z.enum(BLOOM),
        successCriteria: z
          .string()
          .describe("Student-facing success criterion in the plan's language. English: 'I can …'. Turkish: a sentence ending in '…yapabilirim' / '…edebilirim' with NO English words (never write 'I can')."),
      }),
    )
    .describe("1–2 objectives only (a single lesson cannot cover more). If 2, the second is higher-order (Analyse/Evaluate/Create)."),
  priorKnowledge: z.string().describe("What students should already know, plus one quick warm-up question to check it"),
  keyConcepts: z.array(z.object({ term: z.string(), meaning: z.string().describe("Age-appropriate one-sentence definition") })).describe("4–6 key concepts or vocabulary"),
  misconceptions: z
    .array(z.object({ misconception: z.string(), howToAddress: z.string() }))
    .describe("2 common student misconceptions about this topic and how to address each"),
  flow: z
    .array(
      z.object({
        phase: z.string(),
        minutes: z.number().int().min(1),
        whatHappens: z.string().describe("What teacher and students do, 1–2 sentences"),
        check: z.string().describe("How the teacher checks understanding in this phase: one question or quick task"),
      }),
    )
    .describe("4–6 timed phases (e.g. Hook, Explain, Guided practice, Independent practice, Check, Close). Minutes MUST add up exactly to the lesson duration."),
  slides: z
    .array(
      z.object({
        title: z.string(),
        bullets: z.array(z.string()).describe("3–4 short bullets, student-facing, max ~12 words each"),
        visual: z.string().describe("A concrete visual suggestion for this slide (diagram, photo, chart…) describing what it shows"),
      }),
    )
    .describe("Exactly 5 slides following this arc: 1 hook/review, 2 objectives + key concept, 3 core content or worked model, 4 guided practice, 5 discussion + exit ticket"),
  discussionQuestions: z
    .array(z.object({ question: z.string(), whyItWorks: z.string().describe("One short phrase on the thinking it prompts") }))
    .describe("3 open discussion questions at Analyse level or above, each grounded in a concrete context (a scenario, data or short text) and with no single right answer"),
  exitTicket: z.string().describe("One quick check question to see if the main objective was met"),
  differentiation: z.object({
    support: z.string().describe("One idea for students who need more support"),
    stretch: z.string().describe("One idea to stretch students who finish early"),
  }),
});
export type LessonPlan = z.infer<typeof lessonPlanSchema>;

export const EXAMPLES = [
  { topic: "Photosynthesis", subject: "Science", grade: "7" as const },
  { topic: "Fractions on a number line", subject: "Maths", grade: "4" as const },
  { topic: "The water cycle", subject: "Science", grade: "5" as const },
  { topic: "Persuasive writing techniques", subject: "English", grade: "9" as const },
];

export const LESSON_LABELS = {
  en: { gradeLine: (g: string) => `Grade ${g}`, bloom: (b: Bloom) => b as string, min: "min", minutes: "minutes", bigIdea: "Big idea", objectives: "Objectives", byEnd: "By the end of the lesson, students will be able to:", prior: "Before we start", concepts: "Key concepts", flow: "Lesson flow", check: "Check", slides: "Slides", slide: "Slide", visual: "Visual idea", discussion: "Discussion questions", misconceptions: "Watch out for", exit: "Exit ticket", support: "Extra support", stretch: "Stretch", sumWarning: (sum: number, total: number) => `Adds up to ${sum} min (lesson is ${total} min). Adjust as needed.` },
  tr: { gradeLine: (g: string) => `${g}. sınıf`, bloom: (b: Bloom) => BLOOM_TR[b] ?? b, min: "dk", minutes: "dakika", bigIdea: "Temel fikir", objectives: "Öğrenme çıktıları", byEnd: "Ders sonunda öğrenciler:", prior: "Ön bilgi ve ısınma", concepts: "Anahtar kavramlar", flow: "Ders akışı", check: "Kontrol", slides: "Slaytlar", slide: "Slayt", visual: "Görsel fikri", discussion: "Tartışma soruları", misconceptions: "Kavram yanılgıları", exit: "Çıkış bileti", support: "Destekleme", stretch: "Zenginleştirme", sumWarning: (sum: number, total: number) => `Toplam ${sum} dk (ders ${total} dk). Gerekirse ayarlayın.` },
} as const;
export type LessonLabels = (typeof LESSON_LABELS)["en"] | (typeof LESSON_LABELS)["tr"];

export function planToText(p: LessonPlan, meta: { grade: string; duration: string; curriculum: string }, t: LessonLabels = LESSON_LABELS.en): string {
  const L: string[] = [];
  L.push(`# ${p.title}`, `${t.gradeLine(meta.grade)} · ${meta.duration} ${t.min} · ${meta.curriculum}`, "", `${t.bigIdea}: ${p.bigIdea}`, "", `## ${t.objectives}`);
  p.objectives.forEach((o) => L.push(`- ${o.text} (${t.bloom(o.level)}). ${o.successCriteria}`));
  L.push("", `${t.prior}: ${p.priorKnowledge}`);
  L.push("", `## ${t.concepts}`);
  p.keyConcepts.forEach((k) => L.push(`- ${k.term}: ${k.meaning}`));
  L.push("", `## ${t.flow}`);
  p.flow.forEach((f) => L.push(`- ${f.phase} (${f.minutes} ${t.min}): ${f.whatHappens} ${t.check}: ${f.check}`));
  L.push("", `## ${t.slides}`);
  p.slides.forEach((s, i) => {
    L.push(`${i + 1}. ${s.title}`);
    s.bullets.forEach((b) => L.push(`   - ${b}`));
    L.push(`   ${t.visual}: ${s.visual}`);
  });
  L.push("", `## ${t.discussion}`);
  p.discussionQuestions.forEach((q) => L.push(`- ${q.question}`));
  L.push("", `## ${t.misconceptions}`);
  p.misconceptions.forEach((m) => L.push(`- ${m.misconception}: ${m.howToAddress}`));
  L.push("", `${t.exit}: ${p.exitTicket}`, "", `- ${t.support}: ${p.differentiation.support}`, `- ${t.stretch}: ${p.differentiation.stretch}`);
  return L.join("\n");
}
