"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CURRICULA, GRADES, LANGUAGES } from "@/lib/options";
import { DICT, currentUiLang, useUi } from "@/lib/i18n";

export function PageIntro({ forWho, title, children }: { forWho: string; title: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-iron">{forWho}</p>
      <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-tight sm:text-[3.2rem]">{title}</h1>
      <div className="mt-3 text-[1.05rem] text-iron">{children}</div>
    </div>
  );
}

const fieldBase =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-ink shadow-[inset_0_1px_0_rgb(112_100_94/0.04)] focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[0.95rem] font-semibold text-ink">
      {children}
      {hint ? <span className="ml-1.5 font-normal text-iron">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldBase} leading-relaxed ${props.className ?? ""}`} />;
}

export function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldBase} appearance-none bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2370645e' stroke-width='1.6'/%3E%3C/svg%3E\")" }}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export const gradeOptions = GRADES.map((g) => ({ value: g, label: `Grade ${g}` }));
export const curriculumOptions = CURRICULA;
export const languageOptions = LANGUAGES;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "quiet" | "ghost" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-orange-ink text-white hover:bg-orange-deep disabled:bg-sand disabled:text-iron",
    quiet: "border border-line bg-white text-ink hover:bg-cream disabled:text-iron",
    ghost: "text-iron hover:bg-cream-deep hover:text-ink",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
    />
  );
}

export function Chip({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-9 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-purple hover:bg-purple-soft"
    >
      {children}
    </button>
  );
}

/** Purple = the AI's voice. Every AI output carries this badge until the teacher approves it. */
export function DraftBadge({ approved = false }: { approved?: boolean }) {
  const { t } = useUi();
  return approved ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1 text-sm font-semibold text-mint">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {t.approved}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-soft px-3 py-1 text-sm font-semibold text-purple-deep">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5"><path d="M2.5 13.5l1-3.5 7.5-7.5 2.5 2.5L6 12.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      {t.draft}
    </span>
  );
}

/** Named progress steps instead of a bare spinner. Advances on a timer while waiting. */
export function LoadingSteps({ steps, everyMs = 2600 }: { steps: readonly string[]; everyMs?: number }) {
  const { t } = useUi();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), everyMs);
    return () => clearInterval(t);
  }, [steps.length, everyMs]);
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border border-line bg-white p-6 shadow-sheet">
      <ol className="space-y-3">
        {steps.map((s, n) => (
          <li key={s} className={`flex items-center gap-3 ${n > i ? "text-iron/60" : "text-ink"}`}>
            <span
              aria-hidden="true"
              className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${
                n < i ? "border-mint bg-mint-soft text-mint" : n === i ? "animate-pulse border-purple bg-purple-soft text-purple-deep" : "border-line"
              }`}
            >
              {n < i ? "✓" : n + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-iron">{t.takesTime}</p>
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useUi();
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-alert/30 bg-alert-soft px-5 py-4 text-ink">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="quiet" onClick={onRetry}>
          {t.tryAgain}
        </Button>
      ) : null}
    </div>
  );
}

/** `text` may be a function so the value is read at click time (e.g. after the user edits). */
export function CopyButton({
  text,
  label,
  variant = "quiet",
  id,
}: {
  text: string | (() => string);
  label?: string;
  variant?: ButtonProps["variant"];
  id?: string;
}) {
  const { t } = useUi();
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  return (
    <Button
      id={id}
      type="button"
      variant={variant}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
          setState("done");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), 2200);
      }}
    >
      <span aria-live="polite">{state === "done" ? t.copied : state === "failed" ? t.copyFailed : label ?? t.copy}</span>
    </Button>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-sand bg-cream/60 p-8">
      <p className="font-serif text-2xl">{title}</p>
      <div className="mt-2 text-iron">{children}</div>
    </div>
  );
}

/** Error from our API. `retryable: false` means "Try again" won't help right now (e.g. daily quota). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly retryable = true,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const isRetryable = (e: unknown) => !(e instanceof ApiError) || e.retryable;

/** Shared POST helper with friendly errors. */
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const lang = currentUiLang();
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-ui-lang": lang },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(DICT[lang].netError);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error ?? DICT[lang].genericError, data?.retryable !== false);
  return data as T;
}
