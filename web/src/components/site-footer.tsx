"use client";

import { useUi } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useUi();
  return (
    <footer className="no-print mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-iron sm:px-6">
        <p className="max-w-2xl">{t.footer}</p>
      </div>
    </footer>
  );
}
