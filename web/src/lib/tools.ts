export type ToolSlug = "lesson-prep" | "student-chat" | "essay-grader";

export type Tool = {
  slug: ToolSlug;
  audience: "teachers" | "students";
};

/** Names, summaries and copy live in src/lib/i18n.tsx so they follow the UI language. */
export const TOOLS: Tool[] = [
  { slug: "lesson-prep", audience: "teachers" },
  { slug: "student-chat", audience: "students" },
  { slug: "essay-grader", audience: "teachers" },
];
