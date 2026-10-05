"use client";

import { useMemo, useRef, useState } from "react";
import {
  Button,
  CopyButton,
  isRetryable,
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
import {
  CRITERION_LABEL,
  ESSAY_MAX_CHARS,
  ESSAY_MIN_CHARS,
  SAMPLE_ESSAY,
  criterionLabel,
  levelLabel,
  rubricDescriptor,
  type CriterionKey,
  type EssayFeedback,
} from "@/lib/essay";
import type { Curriculum, Grade, Language } from "@/lib/options";
import { gradeOptionsFor, useUi } from "@/lib/i18n";

type Note = EssayFeedback["inlineNotes"][number] & {
  id: number;
  start: number;
  end: number;
  kept: boolean;
  /** Why the note has no highlight: quote not in the essay, or overlapping another note. */
  unplaced?: "not-found" | "overlap";
};

/**
 * Normalise ONE character, always to exactly one character, so indexes stay
 * aligned (plain toLowerCase turns Turkish "İ" into two characters).
 */
function normChar(c: string): string {
  if (c === "İ" || c === "I") return "i";
  if (c === "’" || c === "‘") return "'";
  if (c === "“" || c === "”") return '"';
  if (/\s/.test(c)) return " ";
  return c.toLowerCase()[0] ?? c;
}

/** Normalised text (runs of whitespace collapsed) plus a map back to original indexes. */
function normaliseWithMap(text: string): { norm: string; map: number[] } {
  let norm = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = normChar(text[i]);
    if (c === " " && norm.endsWith(" ")) continue;
    norm += c;
    map.push(i);
  }
  return { norm, map };
}

/** Find each quote in the essay; tolerate curly quotes, whitespace, case and Turkish İ/I. */
function anchorNotes(essay: string, notes: EssayFeedback["inlineNotes"]): Note[] {
  const { norm: normEssay, map } = normaliseWithMap(essay);
  let searchFrom = 0; // notes arrive in essay order, so repeated phrases anchor to the right occurrence
  const out: Note[] = notes.map((n, idx) => {
    const base = { ...n, id: idx + 1, kept: true };
    const quote = n.quote?.trim() ?? "";
    if (quote.length < 3) return { ...base, start: -1, end: -1, unplaced: "not-found" as const };
    let start = essay.indexOf(quote, searchFrom);
    if (start === -1) start = essay.indexOf(quote);
    let end = start + quote.length;
    if (start === -1) {
      const nq = normaliseWithMap(quote).norm.trim();
      const fromNorm = map.findIndex((orig) => orig >= searchFrom);
      let ni = normEssay.indexOf(nq, Math.max(fromNorm, 0));
      if (ni === -1) ni = normEssay.indexOf(nq);
      if (ni !== -1) {
        start = map[ni];
        end = map[Math.min(ni + nq.length - 1, map.length - 1)] + 1;
      }
    }
    if (start === -1) return { ...base, start: -1, end: -1, unplaced: "not-found" as const };
    searchFrom = end;
    return { ...base, start, end };
  });
  // Drop overlaps (keep the first) so highlights never nest.
  const placed: Note[] = [];
  for (const n of [...out].sort((a, b) => a.start - b.start)) {
    if (n.start === -1) continue;
    if (placed.some((p) => n.start < p.end && p.start < n.end)) {
      n.start = n.end = -1;
      n.unplaced = "overlap";
    } else placed.push(n);
  }
  return out;
}

function HighlightedEssay({ essay, notes, activeId, onPick }: { essay: string; notes: Note[]; activeId: number | null; onPick: (id: number) => void }) {
  const { t } = useUi();
  const anchored = notes.filter((n) => n.start >= 0 && n.kept).sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const n of anchored) {
    if (n.start > cursor) parts.push(essay.slice(cursor, n.start));
    const strength = n.kind === "strength";
    parts.push(
      <mark
        key={n.id}
        id={`hl-${n.id}`}
        role="button"
        tabIndex={0}
        aria-label={t.essay.noteAria(n.id, essay.slice(n.start, n.end))}
        onClick={() => onPick(n.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick(n.id);
          }
        }}
        className={`cursor-pointer rounded-sm px-0.5 text-ink underline decoration-2 underline-offset-4 transition-colors ${
          strength ? "bg-mint-soft decoration-mint" : "bg-purple-soft decoration-purple"
        } ${activeId === n.id ? "ring-2 ring-purple" : ""}`}
      >
        {essay.slice(n.start, n.end)}
        <sup className={`ml-0.5 font-sans text-[0.7rem] font-bold ${strength ? "text-mint" : "text-purple-deep"}`}>{n.id}</sup>
      </mark>,
    );
    cursor = n.end;
  }
  parts.push(essay.slice(cursor));
  return <div className="whitespace-pre-wrap font-serif text-[1.2rem] leading-[1.75] text-ink">{parts}</div>;
}

function ScoreCard({
  criterion,
  score,
  aiScore,
  reason,
  nextStep,
  onScore,
}: {
  criterion: CriterionKey;
  score: number;
  aiScore: number;
  reason: string;
  nextStep: string;
  onScore: (s: number) => void;
}) {
  const { lang, t } = useUi();
  const name = criterionLabel(criterion, lang);
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-snug">{name}</h3>
        <p className="shrink-0 text-right text-sm leading-tight text-iron">
          <span className="font-serif text-3xl text-ink">{score}</span>/4
          <span className="block">{levelLabel(score, lang)}</span>
        </p>
      </div>
      <div role="radiogroup" aria-label={t.essay.scoreAria(name)} className="mt-3 grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={score === s}
            aria-label={`${s}, ${levelLabel(s, lang)}`}
            onClick={() => onScore(s)}
            className={`h-9 rounded-lg border text-sm font-semibold transition-colors ${
              score === s ? "border-ink bg-ink text-paper" : s <= score ? "border-sand bg-cream-deep text-ink" : "border-line bg-white text-iron hover:bg-cream"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-iron">
        {score}: {rubricDescriptor(criterion, score, lang)}
        {aiScore === 0 ? <> · {t.essay.notScored}</> : score !== aiScore ? <> · {t.essay.changed(aiScore)}</> : null}
      </p>
      <p className="mt-3 text-[0.95rem] text-ink">{reason}</p>
      <p className="mt-2 text-[0.95rem] text-iron">
        <span className="font-semibold text-purple-deep">{t.essay.nextStep} </span>
        {nextStep}
      </p>
    </div>
  );
}

export function EssayGrader() {
  const { lang: uiLang, t: ui } = useUi();
  const E = ui.essay;
  const [essay, setEssay] = useState("");
  const [prompt, setPrompt] = useState("");
  const [grade, setGrade] = useState<Grade>("8");
  const [curriculum, setCurriculum] = useState<Curriculum>("general");
  // Feedback language follows the UI language until the teacher picks one.
  const [languageChoice, setLanguage] = useState<Language | null>(null);
  const language: Language = languageChoice ?? uiLang;
  const [moreOpen, setMoreOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(true);
  const [feedback, setFeedback] = useState<EssayFeedback | null>(null);
  const [submittedEssay, setSubmittedEssay] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [scores, setScores] = useState<Record<CriterionKey, number>>({ argument: 0, evidence: 0, structure: 0, language: 0 });
  const [summary, setSummary] = useState("");
  const [includeScores, setIncludeScores] = useState(false);
  const [approved, setApproved] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const chars = essay.trim().length;
  const canSubmit = chars >= ESSAY_MIN_CHARS && chars <= ESSAY_MAX_CHARS && !loading;

  async function submit() {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setApproved(false);
    try {
      const data = await postJson<{ feedback: EssayFeedback }>("/api/essay", { essay, prompt, grade, curriculum, language });
      const fb = data.feedback;
      setSubmittedEssay(essay);
      setFeedback(fb);
      setNotes(anchorNotes(essay, fb.inlineNotes ?? []));
      const s = { argument: 2, evidence: 2, structure: 2, language: 2 } as Record<CriterionKey, number>;
      for (const c of fb.criteria ?? []) s[c.criterion] = Math.min(4, Math.max(1, Math.round(c.score)));
      setScores(s);
      setSummary(fb.studentSummary ?? "");
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : ui.genericError);
      setRetryable(isRetryable(e));
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setEssay(SAMPLE_ESSAY.essay);
    setPrompt(SAMPLE_ESSAY.prompt);
    setGrade(SAMPLE_ESSAY.grade);
    setMoreOpen(true);
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const aiScore = (k: CriterionKey) => feedback?.criteria.find((c) => c.criterion === k)?.score ?? 0;

  const shareText = useMemo(() => {
    if (!feedback) return "";
    const lines = [summary.trim()];
    if (includeScores) {
      // Labels in the shared text follow the feedback language (what the student reads).
      lines.push("", ...(Object.keys(scores) as CriterionKey[]).map((k) => `${criterionLabel(k, language)}: ${scores[k]}/4 (${levelLabel(scores[k], language)})`));
    }
    return lines.join("\n");
  }, [feedback, summary, includeScores, scores, language]);

  const pickNote = (id: number) => {
    setActiveId(id);
    document.getElementById(`note-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Step 1: paste */}
      <section aria-label={E.pasteAria} className="no-print grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Label htmlFor="essay">{E.essayLabel}</Label>
            <Button type="button" variant="ghost" onClick={loadSample} className="-mt-2 min-h-9 px-3 text-sm">
              {E.sample}
            </Button>
          </div>
          <TextArea
            id="essay"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            rows={14}
            placeholder={E.essayPh}
            aria-describedby="essay-help"
          />
          <p id="essay-help" className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-iron">
            <span>{E.help}</span>
            <span className={chars > ESSAY_MAX_CHARS ? "text-alert" : ""}>
              {chars < ESSAY_MIN_CHARS ? E.charsNeeded(ESSAY_MIN_CHARS - chars) : `${chars.toLocaleString(uiLang)} / ${ESSAY_MAX_CHARS.toLocaleString(uiLang)}`}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="grade">{ui.grade}</Label>
            <Select id="grade" value={grade} onChange={(v) => setGrade(v as Grade)} options={gradeOptionsFor(uiLang)} />
          </div>
          <div>
            <Label htmlFor="language">{E.feedbackLang}</Label>
            <Select id="language" value={language} onChange={(v) => setLanguage(v as Language)} options={languageOptions} />
          </div>
          <button
            type="button"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((o) => !o)}
            className="text-sm font-semibold text-orange-ink underline-offset-4 hover:underline"
          >
            {moreOpen ? ui.fewerOptions : ui.moreOptions}
          </button>
          {moreOpen ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" hint={ui.optional}>{E.question}</Label>
                <TextInput id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={E.questionPh} />
              </div>
              <div>
                <Label htmlFor="curriculum">{ui.curriculum}</Label>
                <Select id="curriculum" value={curriculum} onChange={(v) => setCurriculum(v as Curriculum)} options={curriculumOptions} />
              </div>
            </div>
          ) : null}
          <Button type="button" onClick={submit} disabled={!canSubmit} className="w-full">
            {loading ? E.submitting : E.submit}
          </Button>
        </div>
      </section>

      <div ref={resultRef} className="scroll-mt-24 space-y-8">
        {loading ? (
          <LoadingSteps steps={E.steps} />
        ) : null}
        {error ? <ErrorNote message={error} onRetry={canSubmit && retryable ? submit : undefined} /> : null}

        {!loading && !error && !feedback ? (
          <EmptyState title={E.emptyTitle}>{E.emptyBody}</EmptyState>
        ) : null}

        {feedback && !feedback.isEssay ? (
          <ErrorNote message={E.notEssay} />
        ) : null}

        {feedback && feedback.isEssay ? (
          <>
            {/* Step 2: review */}
            <section aria-labelledby="step-review" className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="step-review" className="font-serif text-[2rem] leading-tight">
                  {E.review}
                </h2>
                <div className="flex items-center gap-3">
                  <DraftBadge approved={approved} />
                  <p className="text-sm text-iron">
                    {E.total} <span className="font-serif text-2xl text-ink">{total}</span>/16
                  </p>
                </div>
              </div>
              {feedback.teacherNote ? (
                <p className="rounded-xl bg-cream px-4 py-3 text-[0.95rem] text-ink">
                  <span className="font-semibold">{E.forYou} </span>
                  {feedback.teacherNote}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(Object.keys(CRITERION_LABEL) as CriterionKey[]).map((k) => {
                  const c = feedback.criteria.find((x) => x.criterion === k);
                  return (
                    <ScoreCard
                      key={k}
                      criterion={k}
                      score={scores[k]}
                      aiScore={aiScore(k)}
                      reason={c?.reason ?? ""}
                      nextStep={c?.nextStep ?? ""}
                      onScore={(s) => {
                        setScores((prev) => ({ ...prev, [k]: s }));
                        setApproved(false);
                      }}
                    />
                  );
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
                <article aria-label={E.essayAria} className="rounded-2xl border border-line bg-white p-6 shadow-sheet sm:p-8">
                  <HighlightedEssay essay={submittedEssay} notes={notes} activeId={activeId} onPick={pickNote} />
                </article>
                <ol aria-label={E.notesAria} className="space-y-3 lg:max-h-[46rem] lg:overflow-auto lg:pr-1">
                  {notes.map((n) => {
                    const strength = n.kind === "strength";
                    return (
                      <li
                        key={n.id}
                        id={`note-${n.id}`}
                        onMouseEnter={() => setActiveId(n.id)}
                        className={`rounded-2xl border-l-4 bg-white p-4 shadow-sheet transition-opacity ${strength ? "border-mint" : "border-purple"} ${
                          n.kept ? "" : "opacity-50"
                        } ${activeId === n.id ? "ring-2 ring-purple/40" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm font-semibold ${strength ? "text-mint" : "text-purple-deep"}`}>
                            {n.id}. {strength ? E.workingWell : E.toImprove} · {criterionLabel(n.criterion, uiLang)}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, kept: !x.kept } : x)));
                              setApproved(false);
                            }}
                            className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-iron hover:bg-cream-deep"
                          >
                            <span className="sr-only">{n.kept ? E.removeNote(n.id) : E.restoreNote(n.id)}</span>
                            <span aria-hidden="true">{n.kept ? E.remove : E.restore}</span>
                          </button>
                        </div>
                        <blockquote className="mt-2 border-l-2 border-line pl-3 font-serif text-[1.05rem] italic text-iron">
                          &ldquo;{n.quote}&rdquo;
                          {n.unplaced ? (
                            <span className="ml-1 font-sans text-xs not-italic">
                              {n.unplaced === "overlap" ? E.overlap : E.notFound}
                            </span>
                          ) : null}
                        </blockquote>
                        <p className="mt-2 text-[0.95rem] text-ink">{n.note}</p>
                        {n.example ? (
                          <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-[0.95rem] text-ink">
                            <span className="font-semibold">{strength ? E.whyWorks : E.tryRewrite} </span>
                            {n.example}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* Step 3: share */}
            <section aria-labelledby="step-share" className="rounded-2xl border border-line bg-cream p-5 sm:p-7">
              <h2 id="step-share" className="font-serif text-[2rem] leading-tight">
                {E.summaryTitle}
              </h2>
              <p className="mt-1 text-iron">{E.summaryHint}</p>
              <TextArea
                aria-label={E.summaryTitle}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setApproved(false);
                }}
                rows={5}
                className="mt-4 bg-white text-[1.05rem]"
              />
              <label className="mt-3 flex items-center gap-2.5 text-[0.95rem]">
                <input
                  type="checkbox"
                  checked={includeScores}
                  onChange={(e) => {
                    setIncludeScores(e.target.checked);
                    setApproved(false);
                  }}
                  className="h-4.5 w-4.5 accent-[#a85d16]"
                />
                {E.includeScores}
              </label>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {!approved ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setApproved(true);
                      requestAnimationFrame(() => document.getElementById("copy-for-student")?.focus());
                    }}
                    disabled={!summary.trim()}
                  >
                    {E.approve}
                  </Button>
                ) : (
                  <>
                    <DraftBadge approved />
                    <CopyButton id="copy-for-student" text={shareText} label={E.copyForStudent} variant="primary" />
                    <Button type="button" variant="quiet" onClick={() => window.print()}>
                      {ui.print}
                    </Button>
                  </>
                )}
              </div>
              {approved ? (
                <div className="print-area hidden whitespace-pre-wrap p-8 font-serif text-[1.15rem] leading-relaxed print:block">{shareText}</div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
