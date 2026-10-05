/** Shared by server (layout reads the cookie) and client (switch writes it). No "use client" here. */
export const UI_LANG_KEY = "kalem-ui-lang";
export type UiLang = "en" | "tr";

export function parseUiLang(value: string | undefined | null): UiLang {
  return value === "tr" ? "tr" : "en";
}
