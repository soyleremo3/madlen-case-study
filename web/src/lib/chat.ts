export const MAX_USER_MESSAGES = 30;
export const MAX_MESSAGE_CHARS = 1500;

/** Replies to practice questions start with "[hint N/4]"; split it out for the UI. */
export function parseHint(text: string): { hint: number | null; body: string } {
  const m = text.match(/^\s*\[hint\s*([1-4])\s*\/\s*4\]\s*/i);
  if (!m) return { hint: null, body: text };
  return { hint: Number(m[1]), body: text.slice(m[0].length) };
}

/**
 * Small models sometimes tag concept answers as hints. Only show the hint meter
 * when the student's message looks like a practice problem, or when a hint
 * ladder is already running in this chat.
 */
// A bare number is not enough ("300 kelime", "1923'te ne oldu?"): look for maths
// operators or problem verbs.
const PRACTICE_RE = /[=+×÷*/^%]|\d\s*-\s*\d|\b(solve|find|calculate|work out|which option|answer)\b|(?<!\p{L})(çöz|hesapla|bul|kaç|cevab)/iu;

export function looksLikePractice(studentText: string): boolean {
  return PRACTICE_RE.test(studentText);
}

/** For each message, the hint level to display (null = no meter). Pure, render-safe. */
export function visibleHints(messages: { role: string; text: string }[]): (number | null)[] {
  let ladderOn = false;
  let lastWasHint = false;
  return messages.map((m) => {
    if (m.role === "user") {
      ladderOn = looksLikePractice(m.text) || lastWasHint;
      return null;
    }
    const hint = ladderOn ? parseHint(m.text).hint : null;
    lastWasHint = hint !== null;
    return hint;
  });
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

/**
 * Deterministic crisis responder: if a student writes about self-harm or being
 * in danger, we reply with a fixed, caring message instead of calling the model
 * (provider safety filters can otherwise return an empty answer).
 */
const CRISIS_PATTERNS = [
  /\b(kill|hurt|harm|cut)\s+myself\b/i,
  /\bself[-\s]?harm/i,
  /\bsuicid/i,
  /\b(want|wanna)\s+to\s+die\b/i,
  /\bend\s+my\s+life\b/i,
  /kendime\s+zarar/i,
  /intihar/i,
  /ölmek\s+istiyorum/i,
  /kendimi\s+öldür/i,
  /yaşamak\s+istemiyorum/i,
  /canıma\s+kıy/i,
];

export function isCrisisMessage(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

export const CRISIS_REPLY = {
  en: "I'm really glad you told me. What you're feeling matters, and you don't have to deal with it alone. Please talk to a trusted adult right now: a parent, a teacher or your school counsellor. If you might be in danger, call 112 (in Türkiye) or your local emergency number straight away. I'm an AI, so I can't help with this the way a person can, but they can.",
  tr: "Bana söylediğin için gerçekten çok iyi ettin. Hissettiklerin önemli ve bununla tek başına baş etmek zorunda değilsin. Lütfen hemen güvendiğin bir yetişkinle konuş: annen, baban, öğretmenin ya da okulundaki rehber öğretmen. Kendini tehlikede hissediyorsan hemen 112'yi ara. Ben bir yapay zekâyım; bu konuda bir insan kadar yardımcı olamam ama onlar olabilir.",
} as const;

export const FILTERED_NOTE = {
  en: "Part of this answer was blocked by a safety filter. Try asking in a different way, or ask your teacher.",
  tr: "Bu cevabın bir kısmı güvenlik filtresine takıldı. Soruyu farklı bir şekilde sormayı dene ya da öğretmenine sor.",
} as const;
