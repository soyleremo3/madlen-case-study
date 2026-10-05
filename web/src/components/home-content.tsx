"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { useUi } from "@/lib/i18n";

function MarginNoteDemo() {
  const { t } = useUi();
  const h = t.home;
  return (
    <figure aria-label={h.demoAria} className="relative rounded-2xl border border-line bg-white p-6 shadow-sheet sm:p-8">
      <p className="font-serif text-[1.35rem] leading-[1.55] text-ink">
        {h.demoBefore}{" "}
        <mark className="rounded bg-purple-soft px-1 text-ink decoration-purple decoration-2 underline underline-offset-4">{h.demoMark}</mark>{" "}
        {h.demoAfter}
      </p>
      <figcaption className="mt-6 border-l-4 border-purple pl-4 text-[0.95rem] text-ink">
        <span className="font-semibold text-purple-deep">{h.demoLabel}</span>
        <span className="mt-1 block text-iron">{h.demoNote}</span>
      </figcaption>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-orange-ink px-4 py-2 font-semibold text-white">{h.keep}</span>
        <span className="rounded-full border border-line px-4 py-2 text-iron">{h.edit}</span>
        <span className="text-iron">{h.youDecide}</span>
      </div>
    </figure>
  );
}

export function HomeContent() {
  const { t } = useUi();
  const h = t.home;
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <h1 className="font-serif text-[2.75rem] leading-[1.02] tracking-tight sm:text-[3.75rem]">{h.headline}</h1>
          <p className="mt-6 max-w-xl text-lg text-iron">{h.sub}</p>
          <p className="mt-4 max-w-xl text-[0.95rem] text-iron">{h.works}</p>
        </div>
        <MarginNoteDemo />
      </section>

      <section aria-labelledby="tools-heading" className="pb-8">
        <h2 id="tools-heading" className="sr-only">
          {h.toolsHeading}
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {TOOLS.map((tool) => {
            const name = t.nav[tool.slug];
            const copy = h.tools[tool.slug];
            return (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`} className="group grid gap-4 py-8 sm:grid-cols-[14rem_1fr_auto] sm:items-start sm:gap-8">
                  <div>
                    <p className="text-sm text-iron">{tool.audience === "teachers" ? t.forTeachers : t.forStudents}</p>
                    <h3 className="font-serif text-[2rem] leading-tight group-hover:text-orange-deep">{name}</h3>
                  </div>
                  <div>
                    <p className="max-w-xl text-ink">{copy.summary}</p>
                    <ul className="mt-3 flex flex-wrap gap-2 text-sm text-iron">
                      {copy.gives.map((g) => (
                        <li key={g} className="rounded-full bg-cream px-3 py-1">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="self-center justify-self-start rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-semibold text-paper transition-colors group-hover:bg-orange-ink sm:justify-self-end">
                    {h.open(name)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** Localised title + intro for each tool page. */
export function ToolIntro({ tool }: { tool: "lesson" | "essay" | "chat" }) {
  const { t } = useUi();
  const copy = t[tool];
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-iron">{tool === "chat" ? t.forStudents : t.forTeachers}</p>
      <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-tight sm:text-[3.2rem]">{copy.title}</h1>
      <p className="mt-3 text-[1.05rem] text-iron">{copy.intro}</p>
    </div>
  );
}
