import type { Metadata } from "next";
import { ToolIntro } from "@/components/home-content";
import { LessonPrep } from "./lesson-prep";

export const metadata: Metadata = {
  title: "Lesson prep",
  description: "Enter a topic and a grade to get a ready-to-teach lesson plan: objectives, key concepts, a timed flow, 5 slides and discussion questions.",
};

export default function LessonPrepPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ToolIntro tool="lesson" />
      <LessonPrep />
    </div>
  );
}
