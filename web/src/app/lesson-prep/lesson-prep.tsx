"use client";

import { useRef, useState } from "react";
import {
  Button,
  Chip,
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
  gradeOptions,
  languageOptions,
  postJson,
} from "@/components/ui";
import { DURATIONS, EXAMPLES, LESSON_LABELS, planToText, type LessonLabels, type LessonPlan } from "@/lib/lesson";
import { curriculumLabel, type Curriculum, type Grade, type Language } from "@/lib/options";

const durationOptions = DURATIONS.map((d) => ({ value: d, label: `${d} minutes` }));

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
      {sum !== total ? <p data-screen-only className="no-print mt-2 text-sm text-iron">Adds up to {sum} min (lesson is {total} min). Adjust as needed.</p> : null}
    </div>
  );
}

export function LessonPrep() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState<Grade>("7");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("40");
  const [curriculum, setCurriculum] = useState<Curriculum>("maarif");
  const [language, setLanguage] = useState<Language>("en");
  const [notes, setNotes] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [meta, setMeta] = useState({ grade: "7", duration: "40", curriculum: "MEB Maarif (TYMM)", language: "en" as Language });
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
      setMeta({ grade, duration, curriculum: curriculumLabel(curriculum), language });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
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
    if (edited && !window.confirm("Make a new version? Your edits to this plan will be lost.")) return;
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
        <Label htmlFor="topic">What are you teaching?</Label>
        <TextInput
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Photosynthesis, Fractions on a number line, The Ottoman Empire"
          className="text-lg"
          autoComplete="off"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-iron">Try:</span>
          {EXAMPLES.map((ex) => (
            <Chip
              key={ex.topic}
              onClick={() => {
                setTopic(ex.topic);
                setSubject(ex.subject);
                setGrade(ex.grade);
              }}
            >
              {ex.topic}, grade {ex.grade}
            </Chip>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select id="grade" value={grade} onChange={(v) => setGrade(v as Grade)} options={gradeOptions} />
          </div>
          <div>
            <Label htmlFor="duration">Lesson length</Label>
            <Select id="duration" value={duration} onChange={(v) => setDuration(v as (typeof DURATIONS)[number])} options={durationOptions} />
          </div>
          <div>
            <Label htmlFor="language">Plan language</Label>
            <Select id="language" value={language} onChange={(v) => setLanguage(v as Language)} options={languageOptions} />
          </div>
        </div>

        <button type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)} className="mt-4 text-sm font-semibold text-orange-ink underline-offset-4 hover:underline">
          {moreOpen ? "Fewer options" : "More options"}
        </button>
        {moreOpen ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="subject" hint="(optional)">Subject</Label>
              <TextInput id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Science" />
            </div>
            <div>
              <Label htmlFor="curriculum">Curriculum</Label>
              <Select id="curriculum" value={curriculum} onChange={(v) => setCurriculum(v as Curriculum)} options={curriculumOptions} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes" hint="(optional)">Anything else?</Label>
              <TextArea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="e.g. Mixed-ability class, two students learning Turkish, include a hands-on activity" />
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <Button type="submit" disabled={!canSubmit}>
            {loading ? "Planning…" : "Plan my lesson"}
          </Button>
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-24">
        {loading ? <LoadingSteps steps={["Setting objectives and the big idea", "Timing the lesson flow", "Building 5 slides with visual ideas", "Writing discussion questions"]} /> : null}
        {error ? <ErrorNote message={error} onRetry={canSubmit ? submit : undefined} /> : null}
        {!loading && !error && !plan ? (
          <EmptyState title="Your lesson plan appears here">
            Type a topic, pick a grade, and press <strong>Plan my lesson</strong>. Everything in the plan can be edited before you use it.
          </EmptyState>
        ) : null}
        {plan && !plan.isAppropriate ? (
          <ErrorNote message="This topic doesn't look suitable for a school lesson at this grade. Try rephrasing it as a classroom topic." />
        ) : null}

        {plan && plan.isAppropriate ? (
          <div className="space-y-4">
            <div className="no-print flex flex-wrap items-center justify-between gap-3">
              <DraftBadge />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant={editing ? "primary" : "quiet"} onClick={() => setEditing((e) => !e)} aria-pressed={editing}>
                  {editing ? "Done editing" : "Edit plan"}
                </Button>
                <CopyButton text={currentText} label="Copy plan" />
                <Button type="button" variant="quiet" onClick={() => window.print()}>
                  Print
                </Button>
                <Button type="button" variant="ghost" onClick={regenerate} disabled={!canSubmit}>
                  Make another version
                </Button>
              </div>
            </div>
            {editing ? <p className="no-print text-sm text-iron">Click any text in the plan to change it. Copy and Print use your edited version.</p> : null}

            <div
              ref={sheetRef}
              contentEditable={editing}
              suppressContentEditableWarning
              onInput={() => setEdited(true)}
              role={editing ? "textbox" : undefined}
              aria-multiline={editing ? true : undefined}
              aria-label={editing ? "Lesson plan (editable)" : undefined}
              className={`print-area space-y-10 rounded-2xl border bg-white p-6 shadow-sheet outline-none sm:p-10 ${editing ? "border-purple ring-4 ring-purple/15" : "border-line"}`}
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
