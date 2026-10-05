import type { Metadata } from "next";
import { ToolIntro } from "@/components/home-content";
import { EssayGrader } from "./essay-grader";

export const metadata: Metadata = {
  title: "Essay feedback",
  description: "Paste a student essay and get rubric scores, margin notes with examples, and a summary you approve before sharing.",
};

export default function EssayGraderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ToolIntro tool="essay" />
      <EssayGrader />
    </div>
  );
}
