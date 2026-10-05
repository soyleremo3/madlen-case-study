import type { Metadata } from "next";
import { ToolIntro } from "@/components/home-content";
import { StudentChat } from "./student-chat";

export const metadata: Metadata = {
  title: "Study helper",
  description: "Ask about a topic and get answers at your grade level. Practice questions get step-by-step hints instead of the answer.",
};

export default function StudentChatPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ToolIntro tool="chat" />
      <StudentChat />
    </div>
  );
}
