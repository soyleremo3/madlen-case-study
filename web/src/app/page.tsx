import Link from "next/link";
import { TOOLS } from "@/lib/tools";

function MarginNoteDemo() {
  return (
    <figure
      aria-label="Example of an AI margin note on a student essay"
      className="relative rounded-2xl border border-line bg-white p-6 shadow-sheet sm:p-8"
    >
      <p className="font-serif text-[1.35rem] leading-[1.55] text-ink">
        Social media changes how teenagers see themselves.{" "}
        <mark className="rounded bg-purple-soft px-1 text-ink decoration-purple decoration-2 underline underline-offset-4">
          Everyone knows it makes people unhappy.
        </mark>{" "}
        In this essay I will explain why schools should teach students to use it
        wisely.
      </p>
      <figcaption className="mt-6 border-l-4 border-purple pl-4 text-[0.95rem] text-ink">
        <span className="font-semibold text-purple-deep">Argument · draft note</span>
        <span className="mt-1 block text-iron">
          &ldquo;Everyone knows&rdquo; is a claim without evidence. Try: &ldquo;A
          2023 survey of 1,000 teens found that&hellip;&rdquo;
        </span>
      </figcaption>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-orange-ink px-4 py-2 font-semibold text-white">
          Keep note
        </span>
        <span className="rounded-full border border-line px-4 py-2 text-iron">
          Edit
        </span>
        <span className="text-iron">You decide what the student sees.</span>
      </div>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <h1 className="font-serif text-[2.75rem] leading-[1.02] tracking-tight sm:text-[3.75rem]">
            The first draft is ours. The teaching is yours.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-iron">
            Three small AI tools for classrooms in Türkiye and beyond. Plan a lesson
            in a minute, help students think instead of copying answers, and give
            essay feedback you can stand behind.
          </p>
          <p className="mt-4 max-w-xl text-[0.95rem] text-iron">
            Works with MEB Maarif, Cambridge and IB. Answers in English or Türkçe.
          </p>
        </div>
        <MarginNoteDemo />
      </section>

      <section aria-labelledby="tools-heading" className="pb-8">
        <h2 id="tools-heading" className="sr-only">
          Tools
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {TOOLS.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/${tool.slug}`}
                className="group grid gap-4 py-8 sm:grid-cols-[14rem_1fr_auto] sm:items-start sm:gap-8"
              >
                <div>
                  <p className="text-sm text-iron">{tool.forWho}</p>
                  <h3 className="font-serif text-[2rem] leading-tight group-hover:text-orange-deep">
                    {tool.name}
                  </h3>
                </div>
                <div>
                  <p className="max-w-xl text-ink">{tool.summary}</p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm text-iron">
                    {tool.gives.map((g) => (
                      <li key={g} className="rounded-full bg-cream px-3 py-1">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="self-center justify-self-start rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-semibold text-paper transition-colors group-hover:bg-orange-ink sm:justify-self-end">
                  Open {tool.name.toLowerCase()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
