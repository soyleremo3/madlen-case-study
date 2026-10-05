export type ToolSlug = "lesson-prep" | "student-chat" | "essay-grader";

export type Tool = {
  slug: ToolSlug;
  name: string;
  forWho: "For teachers" | "For students";
  summary: string;
  gives: string[];
};

export const TOOLS: Tool[] = [
  {
    slug: "lesson-prep",
    name: "Lesson prep",
    forWho: "For teachers",
    summary: "Enter a topic and a grade. Get a lesson plan you can teach tomorrow.",
    gives: [
      "Objectives and key concepts",
      "A 5-slide outline with a visual idea for each slide",
      "Discussion questions for the class",
    ],
  },
  {
    slug: "student-chat",
    name: "Study buddy",
    forWho: "For students",
    summary: "Ask about a topic and get answers at your grade level. Stuck on a practice question? Get a hint, not the answer.",
    gives: [
      "Explanations pitched at your grade",
      "Step-by-step hints for practice questions",
      "Safe, on-topic conversation",
    ],
  },
  {
    slug: "essay-grader",
    name: "Essay feedback",
    forWho: "For teachers",
    summary: "Paste a student essay. Get a rubric score, notes on exact sentences, and a summary you can edit and share.",
    gives: [
      "Scores on 4 criteria with reasons",
      "Margin notes with example rewrites",
      "A student-friendly summary you approve",
    ],
  },
];
