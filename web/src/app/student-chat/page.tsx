import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { StudentChat } from "./student-chat";

export const metadata: Metadata = {
  title: "Study helper",
  description: "Ask about a topic and get answers at your grade level. Practice questions get step-by-step hints instead of the answer.",
};

export default function StudentChatPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageIntro forWho="For students" title="Study helper">
        Ask about anything you&apos;re learning. Explanations match your grade. Practice problems get hints, one step at a
        time, so the answer is yours.
      </PageIntro>
      <StudentChat />
    </div>
  );
}
