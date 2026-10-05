import { stageOf, type Grade, type Stage } from "./options";

/** Shared by server and client (no "use client"): school stage names per UI language. */
export const STAGE_NAMES: Record<"en" | "tr", Record<Stage, string>> = {
  en: { primary: "Primary school", middle: "Middle school", high: "High school" },
  tr: { primary: "İlkokul", middle: "Ortaokul", high: "Lise" },
};

export function stageName(grade: string, lang: "en" | "tr"): string {
  return STAGE_NAMES[lang][stageOf(grade as Grade)];
}
