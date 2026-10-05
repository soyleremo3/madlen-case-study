import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { LessonPrep } from "./lesson-prep";

export const metadata: Metadata = {
  title: "Lesson prep",
  description: "Enter a topic and a grade to get a ready-to-teach lesson plan: objectives, key concepts, a timed flow, 5 slides and discussion questions.",
};

export default function LessonPrepPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageIntro forWho="For teachers" title="Lesson prep">
        Enter a topic and a grade. Kalem drafts objectives, key concepts, a timed lesson flow, five slides with a visual
        idea for each, and discussion questions. Edit anything before you teach.
      </PageIntro>
      <LessonPrep />
    </div>
  );
}
