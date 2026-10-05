/** User-facing API messages in both UI languages. The client sends its UI language in `x-ui-lang`. */
const MESSAGES = {
  en: {
    tooMany: "You're going a bit fast. Wait a minute, then try again.",
    busy: "The AI is busy right now (free quota reached). Please try again in a minute.",
    generic: "Something went wrong on our side. Please try again.",
    cancelled: "Request cancelled.",
    checkForm: "Please check the form and try again.",
    essayShort: "The essay is too short to assess. Paste at least a full paragraph.",
    essayLong: "That essay is too long for this demo (max ~2,000 words).",
    topicShort: "Tell us the topic (at least a few words).",
    topicLong: "Keep the topic under 200 characters.",
    typeFirst: "Please type a message first.",
    chatLong: "This chat is long enough. Start a new chat to keep going.",
    messageLong: "That message is too long. Please shorten it.",
    planFirst: "Please create the lesson plan first, then try again.",
  },
  tr: {
    tooMany: "Biraz hızlı gidiyorsunuz. Bir dakika bekleyip tekrar deneyin.",
    busy: "Yapay zekâ şu anda yoğun (ücretsiz kota doldu). Lütfen bir dakika sonra tekrar deneyin.",
    generic: "Bizim tarafımızda bir sorun oluştu. Lütfen tekrar deneyin.",
    cancelled: "İstek iptal edildi.",
    checkForm: "Lütfen formu kontrol edip tekrar deneyin.",
    essayShort: "Kompozisyon değerlendirmek için çok kısa. En az bir paragraf yapıştırın.",
    essayLong: "Bu kompozisyon bu demo için çok uzun (en fazla ~2.000 kelime).",
    topicShort: "Konuyu yazın (en az birkaç kelime).",
    topicLong: "Konu 200 karakterden kısa olmalı.",
    typeFirst: "Lütfen önce bir mesaj yazın.",
    chatLong: "Bu sohbet yeterince uzun. Devam etmek için yeni bir sohbet başlatın.",
    messageLong: "Mesaj çok uzun. Lütfen kısaltın.",
    planFirst: "Lütfen önce ders planını oluşturun, sonra tekrar deneyin.",
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)["en"];

export function uiLangOf(req: Request): "en" | "tr" {
  return req.headers.get("x-ui-lang") === "tr" ? "tr" : "en";
}

export function msg(req: Request, key: MessageKey): string {
  return MESSAGES[uiLangOf(req)][key];
}
