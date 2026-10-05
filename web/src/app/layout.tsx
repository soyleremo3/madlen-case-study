import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/lib/i18n";
import { UI_LANG_KEY, parseUiLang } from "@/lib/ui-lang";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "Kalem: AI mini tools for teachers and students",
    template: "%s · Kalem",
  },
  description:
    "Plan a lesson, help a student think, and give essay feedback, with the teacher always in control. A case-study prototype for Madlen.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Render the first HTML in the user's chosen language (cookie set by the TR/EN switch).
  const lang = parseUiLang((await cookies()).get(UI_LANG_KEY)?.value);
  return (
    <html
      lang={lang}
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <LanguageProvider initialLang={lang}>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
