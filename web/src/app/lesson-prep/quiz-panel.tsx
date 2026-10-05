"use client";

import { useState } from "react";
import { Button, CopyButton, DraftBadge, ErrorNote, LoadingSteps, postJson } from "@/components/ui";
import type { LessonPlan } from "@/lib/lesson";
import type { Curriculum, Grade, Language } from "@/lib/options";
import { LETTERS, QUIZ_LABELS, quizToText, type Quiz } from "@/lib/quiz";
import { DICT, currentUiLang } from "@/lib/i18n";

export type PrintTarget = "plan" | "quiz-student" | "quiz-key";

const DIFF_STYLE = {
  easy: "bg-mint-soft text-mint",
  medium: "bg-cream-deep text-orange-deep",
  hard: "bg-purple-soft text-purple-deep",
} as const;

export function QuizPanel({
  plan,
  grade,
  curriculum,
  language,
  printTarget,
  onPrint,
}: {
  plan: LessonPlan;
  grade: Grade;
  curriculum: Curriculum;
  language: Language;
  printTarget: PrintTarget;
  onPrint: (target: PrintTarget) => void;
}) {
  const t = QUIZ_LABELS[language];
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Answer key starts hidden so the teacher can project or print questions first; one click shows it.
  const [showAnswers, setShowAnswers] = useState(false);
  // Questions already shown for this plan, so "Make another quiz" asks for genuinely new ones.
  const [asked, setAsked] = useState<string[]>([]);

  async function create() {
    setLoading(true);
    setError(null);
    setShowAnswers(false);
    try {
      const data = await postJson<{ quiz: Quiz }>("/api/quiz", {
        title: plan.title,
        grade,
        curriculum,
        language,
        objectives: plan.objectives.map((o) => o.text),
        keyConcepts: plan.keyConcepts.map((k) => k.term),
        misconceptions: plan.misconceptions.map((m) => m.misconception),
        avoid: asked.slice(-15),
      });
      setQuiz(data.quiz);
      setAsked((prev) => [...prev, ...data.quiz.questions.map((q) => q.question)].slice(-15));
    } catch (e) {
      setError(e instanceof Error ? e.message : DICT[currentUiLang()].genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="quiz-heading" className="rounded-2xl border border-line bg-white p-6 shadow-sheet sm:p-10">
      <div className="no-print flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="quiz-heading" className="font-serif text-[2rem] leading-tight">
            {t.heading}
          </h2>
          <p className="mt-1 text-iron">{t.intro}</p>
        </div>
        {quiz ? <DraftBadge /> : null}
      </div>

      <div className="no-print mt-5">
        {!quiz && !loading ? (
          <Button type="button" onClick={create}>
            {t.create}
          </Button>
        ) : null}
        {loading ? <LoadingSteps steps={[...t.loadingSteps]} everyMs={2200} /> : null}
        {error ? (
          <div className="mt-4">
            <ErrorNote message={error} onRetry={create} />
          </div>
        ) : null}
      </div>

      {quiz && !loading ? (
        <div className="no-print mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cream px-4 py-3">
            <label className="flex items-center gap-2.5 font-semibold">
              <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} className="h-4.5 w-4.5 accent-[#a85d16]" />
              {t.showAnswers}
            </label>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={() => quizToText(plan.title, quiz, language, true)} label={t.copyKey} />
              <Button type="button" variant="quiet" onClick={() => onPrint("quiz-student")}>
                {t.printStudent}
              </Button>
              <Button type="button" variant="quiet" onClick={() => onPrint("quiz-key")}>
                {t.printKey}
              </Button>
              <Button type="button" variant="ghost" onClick={create}>
                {t.another}
              </Button>
            </div>
          </div>

          <ol className="space-y-4">
            {quiz.questions.map((q, i) => (
              <li key={i} className="rounded-xl border border-line p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className={`rounded-full px-2.5 py-0.5 ${DIFF_STYLE[q.difficulty] ?? DIFF_STYLE.medium}`}>{t.difficulty[q.difficulty] ?? q.difficulty}</span>
                  <span className="text-iron">
                    {t.checks}: {q.objective}
                  </span>
                </div>
                <p className="mt-2 text-[1.08rem] font-semibold">
                  {i + 1}. {q.question}
                </p>

                {q.kind === "multiple_choice" ? (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((o, j) => {
                      const correct = showAnswers && j === q.correctOption;
                      return (
                        <li
                          key={j}
                          className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 ${correct ? "border-mint bg-mint-soft" : "border-line bg-white"}`}
                        >
                          <span className={`font-semibold ${correct ? "text-mint" : "text-iron"}`}>{LETTERS[j]})</span>
                          <span>{o}</span>
                          {correct ? <span className="ml-auto text-sm font-semibold text-mint">✓ {t.answer}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : showAnswers ? (
                  <p className="mt-3 rounded-lg border border-mint bg-mint-soft px-3 py-2">
                    <span className="font-semibold text-mint">{t.answer}: </span>
                    {q.modelAnswer}
                  </p>
                ) : (
                  <div aria-hidden="true" className="mt-4 space-y-4">
                    <div className="border-b border-dashed border-sand" />
                    <div className="border-b border-dashed border-sand" />
                  </div>
                )}

                {showAnswers ? (
                  <div className="mt-3 space-y-1 border-l-4 border-purple pl-3 text-[0.95rem]">
                    <p>
                      <span className="font-semibold text-purple-deep">{t.why}: </span>
                      {q.whyCorrect}
                    </p>
                    <p>
                      <span className="font-semibold text-purple-deep">{t.mistake}: </span>
                      {q.commonMistake}
                    </p>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* Print-only sheets. Only the requested one gets the print-area class. */}
      {quiz ? (
        <>
          <div className={`hidden ${printTarget === "quiz-student" ? "print-area print:block" : ""} p-8`}>
            <p className="font-serif text-3xl">{plan.title}</p>
            <p className="mt-3">{t.nameLine}</p>
            <ol className="mt-6 space-y-6">
              {quiz.questions.map((q, i) => (
                <li key={i} className="break-inside-avoid">
                  <p className="font-semibold">
                    {i + 1}. {q.question}
                  </p>
                  {q.kind === "multiple_choice" ? (
                    <ul className="mt-2 space-y-1 pl-4">
                      {q.options.map((o, j) => (
                        <li key={j}>
                          {LETTERS[j]}) {o}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-iron">
                      {t.answerLines}
                      <br />
                      <br />
                      {t.answerLines}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className={`hidden ${printTarget === "quiz-key" ? "print-area print:block" : ""} whitespace-pre-wrap p-8`}>
            <p className="font-serif text-3xl">
              {t.keyTitle}: {plan.title}
            </p>
            <div className="mt-4">{quizToText("", quiz, language, true).trim()}</div>
          </div>
        </>
      ) : null}
    </section>
  );
}
