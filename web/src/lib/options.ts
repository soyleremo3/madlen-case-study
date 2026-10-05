import { z } from "zod";

export const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;

export const CURRICULA = [
  { value: "maarif", label: "MEB Maarif (TYMM)" },
  { value: "cambridge", label: "Cambridge" },
  { value: "ib", label: "IB" },
  { value: "general", label: "General" },
] as const;

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
] as const;

export const gradeSchema = z.enum(GRADES);
export const curriculumSchema = z.enum(["maarif", "cambridge", "ib", "general"]);
export const languageSchema = z.enum(["en", "tr"]);

export type Grade = z.infer<typeof gradeSchema>;
export type Curriculum = z.infer<typeof curriculumSchema>;
export type Language = z.infer<typeof languageSchema>;

export function curriculumLabel(c: Curriculum): string {
  return CURRICULA.find((x) => x.value === c)?.label ?? "General";
}

/** Prompt fragment describing the curriculum context. */
export function curriculumContext(c: Curriculum, grade: Grade): string {
  switch (c) {
    case "maarif":
      return `Türkiye's national curriculum, the MEB "Türkiye Yüzyılı Maarif Modeli" (TYMM), grade ${grade}. Use Maarif terminology where natural (öğrenme çıktıları / learning outcomes, beceriler / skills, değerler / values) and keep content consistent with what Turkish grade ${grade} students study.`;
    case "cambridge":
      return `The Cambridge curriculum (Cambridge Primary / Lower Secondary / IGCSE as appropriate for grade ${grade}).`;
    case "ib":
      return `The International Baccalaureate (PYP / MYP / DP as appropriate for grade ${grade}), with inquiry-based framing.`;
    default:
      return `A general school curriculum for grade ${grade}.`;
  }
}

export function languageName(l: Language): string {
  return l === "tr" ? "Turkish (Türkçe)" : "English";
}

/** Approximate student age for a grade (Türkiye/UK-style: grade 1 ≈ age 6–7). */
export function ageForGrade(grade: Grade): string {
  const g = Number(grade);
  return `${g + 5}–${g + 6}`;
}

/** School stages as in Türkiye's 4+4+4 system. */
export type Stage = "primary" | "middle" | "high";
export const STAGES: { stage: Stage; grades: Grade[] }[] = [
  { stage: "primary", grades: ["1", "2", "3", "4"] },
  { stage: "middle", grades: ["5", "6", "7", "8"] },
  { stage: "high", grades: ["9", "10", "11", "12"] },
];

export function stageOf(grade: Grade): Stage {
  const g = Number(grade);
  return g <= 4 ? "primary" : g <= 8 ? "middle" : "high";
}

/** For prompts: "grade 7, middle school (ortaokul), students about 12–13 years old". */
export function gradeDescription(grade: Grade): string {
  const stage = { primary: "primary school (ilkokul)", middle: "middle school (ortaokul)", high: "high school (lise)" }[stageOf(grade)];
  return `grade ${grade}, ${stage}, students about ${ageForGrade(grade)} years old`;
}
