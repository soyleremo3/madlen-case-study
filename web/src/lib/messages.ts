/**
 * User-facing API messages in both UI languages. Each says what happened and what to do.
 * The client sends its UI language in `x-ui-lang`. "{s}" is replaced with a number of seconds.
 */
const MESSAGES = {
  en: {
    tooMany: "Too many requests in a short time. Wait {s} seconds, then try again.",
    quotaMinute: "This minute's free AI limit is used up. Wait about a minute, then try again.",
    quotaDay: "Today's free AI quota is used up. It resets at 10:00 (Türkiye time). A paid API key removes this demo limit.",
    quota: "The free AI limit is used up for now. Wait a minute and try again. If it still fails, today's quota is used up; it resets at 10:00 (Türkiye time).",
    overload: "Google's AI servers are very busy right now. Try again in 1–2 minutes.",
    timeout: "The AI took too long to answer. Try again; if it keeps happening, use a shorter text.",
    badOutput: "The AI couldn't produce a complete result this time. Try again, or phrase the topic differently.",
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
    streamCut: "The answer was interrupted. Please send your message again.",
  },
  tr: {
    tooMany: "Kısa sürede çok fazla istek gönderildi. {s} saniye bekleyip tekrar deneyin.",
    quotaMinute: "Bu dakikanın ücretsiz yapay zekâ limiti doldu. Yaklaşık 1 dakika bekleyip tekrar deneyin.",
    quotaDay: "Bugünkü ücretsiz yapay zekâ kotası doldu. Kota 10:00'da (Türkiye saati) yenilenir. Ücretli bir API anahtarı bu demo sınırını kaldırır.",
    quota: "Ücretsiz yapay zekâ limiti şimdilik doldu. 1 dakika bekleyip tekrar deneyin. Yine olmazsa bugünkü kota dolmuştur; 10:00'da (Türkiye saati) yenilenir.",
    overload: "Google'ın yapay zekâ sunucuları şu anda çok yoğun. 1–2 dakika sonra tekrar deneyin.",
    timeout: "Yapay zekâ geç cevap verdi. Tekrar deneyin; sürerse daha kısa bir metin kullanın.",
    badOutput: "Yapay zekâ bu sefer tam bir sonuç üretemedi. Tekrar deneyin ya da konuyu farklı yazın.",
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
    streamCut: "Cevap yarıda kesildi. Lütfen mesajını tekrar gönder.",
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)["en"];

export function uiLangOf(req: Request): "en" | "tr" {
  return req.headers.get("x-ui-lang") === "tr" ? "tr" : "en";
}

export function msg(req: Request, key: MessageKey, seconds?: number): string {
  const text: string = MESSAGES[uiLangOf(req)][key];
  return seconds === undefined ? text : text.replace("{s}", String(seconds));
}
