"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, Chip, Label, Select, TextInput, gradeOptions, languageOptions } from "@/components/ui";
import { MAX_MESSAGE_CHARS, MAX_USER_MESSAGES, QUICK_ACTIONS, STARTERS, parseHint, visibleHints } from "@/lib/chat";
import type { Grade, Language } from "@/lib/options";

/** Tiny, safe renderer: **bold** and line breaks only. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? <strong key={j}>{seg.slice(2, -2)}</strong> : <Fragment key={j}>{seg}</Fragment>,
          )}
        </Fragment>
      ))}
    </>
  );
}

function HintMeter({ level, language }: { level: number; language: Language }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-purple-soft px-3 py-1 text-xs font-semibold text-purple-deep">
      {language === "tr" ? `İpucu ${level}/4` : `Hint ${level} of 4`}
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 w-3 rounded-full ${n <= level ? "bg-purple" : "bg-purple/25"}`} />
        ))}
      </span>
    </span>
  );
}

function friendlyError(error: Error | undefined): string {
  if (!error) return "";
  try {
    const parsed = JSON.parse(error.message);
    if (parsed?.error) return parsed.error;
  } catch {}
  return "Something went wrong. Please try sending your message again.";
}

export function StudentChat() {
  const [grade, setGrade] = useState<Grade>("7");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";
  const userCount = messages.filter((m) => m.role === "user").length;
  const atLimit = userCount >= MAX_USER_MESSAGES;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy || atLimit) return;
    clearError();
    sendMessage({ text: t.slice(0, MAX_MESSAGE_CHARS) }, { body: { grade, subject, language } });
    setInput("");
  }

  function applyQuick(text: string) {
    if (text.endsWith(": ")) {
      setInput(text);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(text.length, text.length);
      });
    } else send(text);
  }

  const L = language === "tr";
  const texts = messages.map((m) => ({ role: m.role, text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join("") }));
  const hints = visibleHints(texts);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[17rem_1fr]">
      <aside className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sheet lg:self-start">
        <div>
          <Label htmlFor="grade">My grade</Label>
          <Select id="grade" value={grade} onChange={(v) => setGrade(v as Grade)} options={gradeOptions} />
        </div>
        <div>
          <Label htmlFor="subject" hint="(optional)">What are you studying?</Label>
          <TextInput id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Maths: equations" maxLength={80} />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select id="language" value={language} onChange={(v) => setLanguage(v as Language)} options={languageOptions} />
        </div>
        <div className="rounded-xl bg-cream p-3.5 text-sm text-iron">
          <p className="font-semibold text-ink">How it helps</p>
          <p className="mt-1">Questions about ideas get a clear explanation. Practice problems get hints, one step at a time, so you learn to solve them yourself.</p>
        </div>
        {messages.length ? (
          <Button
            type="button"
            variant="quiet"
            className="w-full"
            onClick={() => {
              stop();
              setMessages([]);
              clearError();
            }}
          >
            Start a new chat
          </Button>
        ) : null}
      </aside>

      <section aria-label="Chat" className="flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sheet">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-cream/60 px-5 py-3 text-sm">
          <p className="text-iron">
            <span className="font-semibold text-ink">AI study helper.</span> I can make mistakes, so check with your teacher.
          </p>
          <p className="shrink-0 text-iron">
            {userCount}/{MAX_USER_MESSAGES}
          </p>
        </div>

        <div ref={listRef} aria-live="polite" className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6 lg:max-h-[60vh]">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-8 text-center">
              <p className="font-serif text-[2rem] leading-tight">{L ? "Neyi merak ediyorsun?" : "What are you working on?"}</p>
              <p className="mt-2 text-iron">{L ? "Bir soru sor ya da bir alıştırma sorusu yapıştır." : "Ask a question, or paste a practice problem you're stuck on."}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {STARTERS[language].map((s) => (
                  <Chip key={s} onClick={() => send(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, idx) => {
            const text = texts[idx].text;
            if (m.role === "user") {
              return (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-paper">{text}</p>
                </div>
              );
            }
            const hint = hints[idx];
            const body = parseHint(text).body;
            return (
              <div key={m.id} className="max-w-[92%] border-l-4 border-purple pl-4">
                {hint ? (
                  <div className="mb-1.5">
                    <HintMeter level={hint} language={language} />
                  </div>
                ) : null}
                <p className="text-[1.03rem] leading-relaxed text-ink">
                  <RichText text={body} />
                </p>
              </div>
            );
          })}

          {status === "submitted" ? (
            <p className="flex items-center gap-2 pl-5 text-iron" role="status">
              <span className="inline-flex gap-1" aria-hidden="true">
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple" />
              </span>
              {L ? "Düşünüyor…" : "Thinking…"}
            </p>
          ) : null}

          {error ? (
            <div role="alert" className="rounded-xl border border-alert/30 bg-alert-soft px-4 py-3 text-ink">
              {friendlyError(error)}
            </div>
          ) : null}
          {atLimit ? (
            <p className="rounded-xl bg-cream px-4 py-3 text-ink">
              {L ? "Bu sohbet yeterince uzun. Ara verip yeni bir sohbet başlatabilirsin." : "That's a long chat! Take a short break, then start a new chat to keep going."}
            </p>
          ) : null}
        </div>

        <div className="border-t border-line bg-paper/60 p-3 sm:p-4">
          {messages.length > 0 && !atLimit ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_ACTIONS[language].map((q) => (
                <Chip key={q.label} onClick={() => applyQuick(q.text)}>
                  {q.label}
                </Chip>
              ))}
            </div>
          ) : null}
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={MAX_MESSAGE_CHARS}
              disabled={atLimit}
              placeholder={L ? "Mesajını yaz… (Enter ile gönder)" : "Type your question… (Enter to send)"}
              className="max-h-40 min-h-11 flex-1 resize-y rounded-2xl border border-line bg-white px-4 py-2.5 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30"
            />
            {busy ? (
              <Button type="button" variant="quiet" onClick={() => stop()}>
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim() || atLimit}>
                Send
              </Button>
            )}
          </form>
          <p className="mt-2 text-xs text-iron">Don&apos;t share personal details like your full name, school or address.</p>
        </div>
      </section>
    </div>
  );
}
