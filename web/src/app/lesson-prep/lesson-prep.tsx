"use client";

import { useRef, useState } from "react";
import {
  Button,
  Chip,
  isRetryable,
  CopyButton,
  DraftBadge,
  EmptyState,
  ErrorNote,
  Label,
  LoadingSteps,
  Select,
  TextArea,
  TextInput,
  curriculumOptions,
  languageOptions,
  postJson,
} from "@/components/ui";
import { DURATIONS, LESSON_LABELS, planToText, type LessonLabels, type LessonPlan } from "@/lib/lesson";
import { gradeGroupsFor, useUi } from "@/lib/i18n";
import { curriculumLabel, type Curriculum, type Grade, type Language } from "@/lib/options";
import { QuizPanel, type PrintTarget } from "./quiz-panel";


const PHASE_TINTS = ["bg-orange", "bg-purple", "bg-[#c99a5b]", "bg-[#7f6fc4]", "bg-[#b9772f]", "bg-[#a596e4]"];

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h3 className="mb-3 font-serif text-[1.6rem] leading-tight">{title}</h3>
      {children}
    </section>
  );
}

function Timeline({ flow, total, t }: { flow: LessonPlan["flow"]; total: number; t: LessonLabels }) {
  const sum = flow.reduce((a, f) => a + f.minutes, 0) || 1;
  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full" aria-hidden="true">
        {flow.map((f, i) => (
          <div key={i} className={`${PHASE_TINTS[i % PHASE_TINTS.length]} border-r-2 border-white last:border-r-0`} style={{ width: `${(f.minutes / sum) * 100}%` }} />
        ))}
      </div>
      <ol className="mt-4 space-y-3">
        {flow.map((f, i) => (
          <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-3">
            <span className="flex items-start gap-2 text-sm font-semibold text-ink">
              <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${PHASE_TINTS[i % PHASE_TINTS.length]}`} />
              {f.minutes} {t.min}
            </span>
            <div>
              <p>
                <span className="font-semibold">{f.phase}.</span> <span className="text-ink">{f.whatHappens}</span>
              </p>
              {f.check ? (
                <p className="mt-0.5 text-[0.92rem] text-iron">
                  <span className="font-semibold text-purple-deep">{t.check}: </span>
                  {f.check}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {sum !== total ? <p data-screen-only className="no-print mt-2 text-sm text-iron">{t.sumWarning(sum, total)}</p> : null}
    </div>
  );
}

export function LessonPrep() {
  const { lang: uiLang, t: ui } = useUi();
  const L = ui.lesson;
  const durationOptions = DURATIONS.map((d) => ({ value: d, label: L.minutesOpt(d) }));
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState<Grade>("7");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("40");
  const [curriculum, setCurriculum] = useState<Curriculum>("maarif");
  // Output language follows the UI language until the teacher picks one.
  const [languageChoice, setLanguage] = useState<Language | null>(null);
  const language: Language = languageChoice ?? uiLang;
  const [notes, setNotes] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(true);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [meta, setMeta] = useState({
    grade: "7" as Grade,
    duration: "40",
    curriculum: "MEB Maarif (TYMM)",
    curriculumKey: "maarif" as Curriculum,
    language: "en" as Language,
  });
  const [printTarget, setPrintTarget] = useState<PrintTarget>("plan");
  const printAs = (target: PrintTarget) => {
    setPrintTarget(target);
    // Let React apply the print-area class before the print dialog opens.
    setTimeout(() => {
      window.print();
      setPrintTarget("plan");
    }, 60);
  };
  const [editing, setEditing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const canSubmit = topic.trim().length >= 3 && !loading;

  async function submit() {
    setLoading(true);
    setError(null);
    setPlan(null);
    setEditing(false);
    try {
      const data = await postJson<{ plan: LessonPlan }>("/api/lesson", { topic, subject, grade, duration, curriculum, language, notes });
      setPlan(data.plan);
      setMeta({ grade, duration, curriculum: curriculumLabel(curriculum), curriculumKey: curriculum, language });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : ui.genericError);
      setRetryable(isRetryable(e));
    } finally {
      setLoading(false);
    }
  }

  const t = LESSON_LABELS[meta.language];
  const currentText = () => {
    const el = sheetRef.current;
    if (!el) return plan ? planToText(plan, meta, t) : "";
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-screen-only]").forEach((n) => n.remove());
    // innerText needs layout; textContent on a detached clone loses line breaks, so attach briefly.
    clone.style.position = "fixed";
    clone.style.left = "-99999px";
    document.body.appendChild(clone);
    const text = clone.innerText;
    clone.remove();
    return text;
  };
  const [edited, setEdited] = useState(false);
  const regenerate = () => {
    if (edited && !window.confirm(L.confirmDiscard)) return;
    setEdited(false);
    submit();
  };

  return (
    <div className="mt-8 space-y-8">
      <form
        className="no-print rounded-2xl border border-line bg-white p-5 shadow-sheet sm:p-7"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) submit();
        }}
      >
        <Label htmlFor="topic">{L.whatTeaching}</Label>
        <TextInput
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={L.topicPh}
          className="text-lg"
          autoComplete="off"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-iron">{L.tryLabel}</span>
          {L.examples.map((ex) => (
            <Chip
              key={ex.topic}
              onClick={() => {
                setTopic(ex.topic);
                setSubject(ex.subject);
                setGrade(ex.grade as Grade);
              }}
            >
              {L.exampleChip(ex.topic, ex.grade)}
            </Chip>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="grade">{ui.grade}</Label>
            <Select id="grade" value={grade} onChange={(v) => setGrade(v as Grade)} groups={gradeGroupsFor(uiLang)} />
          </div>
          <div>
            <Label htmlFor="duration">{L.length}</Label>
            <Select id="duration" value={duration} onChange={(v) => setDuration(v as (typeof DURATIONS)[number])} options={durationOptions} />
          </div>
          <div>
            <Label htmlFor="language">{L.planLang}</Label>
            <Select id="language" value={language} onChange={(v) => setLanguage(v as Language)} options={languageOptions} />
          </div>
        </div>

        <button type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)} className="mt-4 text-sm font-semibold text-orange-ink underline-offset-4 hover:underline">
          {moreOpen ? ui.fewerOptions : ui.moreOptions}
        </button>
        {moreOpen ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="subject" hint={ui.optional}>{L.subject}</Label>
              <TextInput id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={L.subjectPh} />
            </div>
            <div>
              <Label htmlFor="curriculum">{ui.curriculum}</Label>
              <Select id="curriculum" value={curriculum} onChange={(v) => setCurriculum(v as Curriculum)} options={curriculumOptions} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes" hint={ui.optional}>{L.anything}</Label>
              <TextArea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder={L.anythingPh} />
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <Button type="submit" disabled={!canSubmit}>
            {loading ? L.submitting : L.submit}
          </Button>
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-24">
        {loading ? <LoadingSteps steps={L.steps} /> : null}
        {error ? <ErrorNote message={error} onRetry={canSubmit && retryable ? submit : undefined} /> : null}
        {!loading && !error && !plan ? (
          <EmptyState title={L.emptyTitle}>{L.emptyBody}</EmptyState>
        ) : null}
        {plan && !plan.isAppropriate ? (
          <ErrorNote message={L.notAppropriate} />
        ) : null}

        {plan && plan.isAppropriate ? (
          <div className="space-y-4">
            <div className="no-print flex flex-wrap items-center justify-between gap-3">
              <DraftBadge />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant={editing ? "primary" : "quiet"} onClick={() => setEditing((e) => !e)} aria-pressed={editing}>
                  {editing ? L.doneEditing : L.editPlan}
                </Button>
                <CopyButton text={currentText} label={L.copyPlan} />
                <Button type="button" variant="quiet" onClick={() => printAs("plan")}>
                  {ui.print}
                </Button>
                <Button type="button" variant="ghost" onClick={regenerate} disabled={!canSubmit}>
                  {L.another}
                </Button>
              </div>
            </div>
            {editing ? <p className="no-print text-sm text-iron">{L.editHint}</p> : null}

            <div
              ref={sheetRef}
              contentEditable={editing}
              suppressContentEditableWarning
              onInput={() => setEdited(true)}
              role={editing ? "textbox" : undefined}
              aria-multiline={editing ? true : undefined}
              aria-label={editing ? L.editPlan : undefined}
              className={`${printTarget === "plan" ? "print-area" : ""} space-y-10 rounded-2xl border bg-white p-6 shadow-sheet outline-none sm:p-10 ${editing ? "border-purple ring-4 ring-purple/15" : "border-line"}`}
            >
              <header>
                <p className="text-sm text-iron">
                  {t.gradeLine(meta.grade)} · {meta.duration} {t.minutes} · {meta.curriculum}
                </p>
                <h2 className="mt-1 font-serif text-[2.4rem] leading-[1.05] sm:text-[3rem]">{plan.title}</h2>
                <p className="mt-3 max-w-3xl text-lg text-ink">
                  <span className="font-semibold">{t.bigIdea}: </span>
                  {plan.bigIdea}
                </p>
              </header>

              <div className="grid gap-10 lg:grid-cols-2">
                <Section title={t.objectives}>
                  <p className="mb-3 text-sm text-iron">{t.byEnd}</p>
                  <ul className="space-y-3">
                    {plan.objectives.map((o, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 rounded-full bg-purple-soft px-2.5 py-0.5 text-xs font-semibold text-purple-deep">{t.bloom(o.level)}</span>
                        <span>
                          {o.text}
                          {o.successCriteria ? <span className="mt-0.5 block text-[0.92rem] italic text-iron">{o.successCriteria}</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {plan.priorKnowledge ? (
                    <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-[0.95rem]">
                      <span className="font-semibold">{t.prior}: </span>
                      {plan.priorKnowledge}
                    </p>
                  ) : null}
                </Section>
                <Section title={t.concepts}>
                  <dl className="space-y-2.5">
                    {plan.keyConcepts.map((k, i) => (
                      <div key={i}>
                        <dt className="inline font-semibold">{k.term}: </dt>
                        <dd className="inline text-ink">{k.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </Section>
              </div>

              <Section title={t.flow}>
                <Timeline flow={plan.flow} total={Number(meta.duration)} t={t} />
              </Section>

              <Section title={t.slides}>
                <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {plan.slides.map((s, i) => (
                    <li key={i} className="flex flex-col overflow-hidden rounded-xl border border-line bg-cream break-inside-avoid">
                      <div className="flex-1 p-5">
                        <p className="text-xs font-semibold text-iron">{t.slide} {i + 1}</p>
                        <p className="mt-1 font-serif text-[1.45rem] leading-tight">{s.title}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-[0.95rem]">
                          {s.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="border-t border-line bg-purple-soft/70 px-5 py-3 text-[0.9rem] text-ink">
                        <span className="font-semibold text-purple-deep">{t.visual}: </span>
                        {s.visual}
                      </p>
                    </li>
                  ))}
                </ol>
              </Section>

              <div className="grid gap-10 lg:grid-cols-2">
                <Section title={t.discussion}>
                  <ol className="list-decimal space-y-3 pl-5">
                    {plan.discussionQuestions.map((q, i) => (
                      <li key={i}>
                        <p className="font-semibold">{q.question}</p>
                        <p className="text-sm text-iron">{q.whyItWorks}</p>
                      </li>
                    ))}
                  </ol>
                </Section>
                <Section title={t.misconceptions}>
                  <ul className="space-y-3">
                    {plan.misconceptions.map((m, i) => (
                      <li key={i}>
                        <p className="font-semibold">&ldquo;{m.misconception}&rdquo;</p>
                        <p className="text-ink">{m.howToAddress}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>

              <div className="grid gap-6 rounded-xl bg-cream p-5 sm:grid-cols-3">
                <div>
                  <p className="font-semibold">{t.exit}</p>
                  <p>{plan.exitTicket}</p>
                </div>
                <div>
                  <p className="font-semibold">{t.support}</p>
                  <p>{plan.differentiation.support}</p>
                </div>
                <div>
                  <p className="font-semibold">{t.stretch}</p>
                  <p>{plan.differentiation.stretch}</p>
                </div>
              </div>
            </div>

            <QuizPanel
              key={plan.title}
              plan={plan}
              grade={meta.grade}
              curriculum={meta.curriculumKey}
              language={meta.language}
              printTarget={printTarget}
              onPrint={printAs}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
