export const MAX_USER_MESSAGES = 30;
export const MAX_MESSAGE_CHARS = 1500;

/** Replies to practice questions start with "[hint N/4]"; split it out for the UI. */
export function parseHint(text: string): { hint: number | null; body: string } {
  const m = text.match(/^\s*\[hint\s*([1-4])\s*\/\s*4\]\s*/i);
  if (!m) return { hint: null, body: text };
  return { hint: Number(m[1]), body: text.slice(m[0].length) };
}

export const QUICK_ACTIONS = {
  en: [
    { label: "Give me a hint", text: "Can you give me a hint?" },
    { label: "Check my answer", text: "Can you check my answer? Here it is: " },
    { label: "Explain it more simply", text: "Can you explain that more simply?" },
    { label: "Show me one step", text: "I'm stuck. Can you show me the next step?" },
  ],
  tr: [
    { label: "İpucu ver", text: "Bana bir ipucu verir misin?" },
    { label: "Cevabımı kontrol et", text: "Cevabımı kontrol eder misin? Cevabım: " },
    { label: "Daha basit anlat", text: "Bunu daha basit anlatır mısın?" },
    { label: "Bir adımı göster", text: "Takıldım. Sonraki adımı gösterir misin?" },
  ],
} as const;

export const STARTERS = {
  en: ["What is photosynthesis?", "Solve: 3x + 5 = 20", "Why do we have seasons?", "What's the difference between weather and climate?"],
  tr: ["Fotosentez nedir?", "Çöz: 3x + 5 = 20", "Mevsimler neden oluşur?", "Hava durumu ile iklim arasındaki fark ne?"],
} as const;
