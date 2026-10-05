"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/lib/tools";

export function Wordmark() {
  return (
    <span className="relative inline-block font-serif text-[2rem] leading-none tracking-tight text-ink">
      Kalem
      <svg
        aria-hidden="true"
        viewBox="0 0 120 12"
        className="absolute -bottom-2 left-0 h-3 w-full text-purple"
        preserveAspectRatio="none"
      >
        <path
          d="M2 8c18-5 40-6 62-4s38 2 54-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="no-print border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75 sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Kalem home" className="rounded-md">
          <Wordmark />
        </Link>
        <nav aria-label="Tools" className="flex flex-wrap gap-1 text-[0.95rem]">
          {TOOLS.map((tool) => {
            const active = pathname === `/${tool.slug}`;
            return (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "text-iron hover:bg-cream-deep hover:text-ink"
                }`}
              >
                {tool.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
