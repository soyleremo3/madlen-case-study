import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { EssayGrader } from "./essay-grader";

export const metadata: Metadata = {
  title: "Essay feedback",
  description: "Paste a student essay and get rubric scores, margin notes with examples, and a summary you approve before sharing.",
};

export default function EssayGraderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageIntro forWho="For teachers" title="Essay feedback">
        Paste an essay. Kalem drafts scores on four criteria, notes on exact sentences, and a summary for the student.
        You change anything you disagree with, then approve it.
      </PageIntro>
      <EssayGrader />
    </div>
  );
}
