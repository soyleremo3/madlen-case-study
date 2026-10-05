"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { STAGES } from "./options";
import { STAGE_NAMES } from "./stage-name";
import { UI_LANG_KEY as STORAGE_KEY, type UiLang } from "./ui-lang";

export type { UiLang };

const EN = {
  langName: "English",
  switchTo: "Türkçe",
  switchAria: "Change language",
  forTeachers: "For teachers",
  forStudents: "For students",
  grade: "School level / grade",
  gradeOption: (g: string) => `Grade ${g}`,
  curriculum: "Curriculum",
  moreOptions: "More options",
  fewerOptions: "Fewer options",
  optional: "(optional)",
  tryAgain: "Try again",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Couldn't copy: select the text instead",
  print: "Print",
  draft: "AI draft: check before using",
  approved: "Approved by you",
  takesTime: "This usually takes 10–25 seconds.",
  netError: "Can't reach the server. Check your internet connection and try again.",
  genericError: "Something went wrong. Please try again.",
  nav: { "lesson-prep": "Lesson prep", "student-chat": "Study helper", "essay-grader": "Essay feedback" },
  footer:
    "Kalem is a case-study prototype built for Madlen's Growth Intern application. It is not an official Madlen product. AI output is a draft: please check it before using it with students, and don't enter students' names or personal details.",
  home: {
    headline: "The first draft is ours. The teaching is yours.",
    sub: "Three small AI tools for classrooms in Türkiye and beyond. Plan a lesson in a minute, help students think instead of copying answers, and give essay feedback you can stand behind.",
    works: "Works with MEB Maarif, Cambridge and IB. Answers in English or Türkçe.",
    demoAria: "Example of an AI margin note on a student essay",
    demoBefore: "Social media changes how teenagers see themselves.",
    demoMark: "Everyone knows it makes people unhappy.",
    demoAfter: "In this essay I will explain why schools should teach students to use it wisely.",
    demoLabel: "Argument · draft note",
    demoNote: "“Everyone knows” is a claim without evidence. Try: “A 2023 survey of 1,000 teens found that…”",
    keep: "Keep note",
    edit: "Edit",
    youDecide: "You decide what the student sees.",
    toolsHeading: "Tools",
    open: (name: string) => `Open ${name.toLowerCase()}`,
    tools: {
      "lesson-prep": {
        summary: "Enter a topic and a grade. Get a lesson plan you can teach tomorrow.",
        gives: ["Objectives and key concepts", "A 5-slide outline with a visual idea for each slide", "Discussion questions and a quick quiz"],
      },
      "student-chat": {
        summary: "Ask about a topic and get answers at your grade level. Stuck on a practice problem? Get a hint, one step at a time.",
        gives: ["Explanations pitched at your grade", "Step-by-step hints for practice questions", "Safe, on-topic conversation"],
      },
      "essay-grader": {
        summary: "Paste a student essay. Get a rubric score, notes on exact sentences, and a summary you can edit and share.",
        gives: ["Scores on 4 criteria with reasons", "Margin notes with example rewrites", "A student-friendly summary you approve"],
      },
    },
  },
  lesson: {
    title: "Lesson prep",
    intro:
      "Enter a topic and a grade. Kalem drafts objectives, key concepts, a timed lesson flow, five slides with a visual idea for each, and discussion questions. Edit anything before you teach.",
    whatTeaching: "What are you teaching?",
    topicPh: "e.g. Photosynthesis, Fractions on a number line, The Ottoman Empire",
    tryLabel: "Try:",
    exampleChip: (topic: string, g: string) => `${topic}, grade ${g}`,
    length: "Lesson length",
    minutesOpt: (d: string) => `${d} minutes`,
    planLang: "Plan language",
    subject: "Subject",
    subjectPh: "e.g. Science",
    anything: "Anything else?",
    anythingPh: "e.g. Mixed-ability class, two students learning Turkish, include a hands-on activity",
    submit: "Plan my lesson",
    submitting: "Planning…",
    steps: ["Setting objectives and the big idea", "Timing the lesson flow", "Building 5 slides with visual ideas", "Writing discussion questions"],
    emptyTitle: "Your lesson plan appears here",
    emptyBody: "Type a topic, pick a grade, and press “Plan my lesson”. Everything in the plan can be edited before you use it.",
    notAppropriate: "This topic doesn't look suitable for a school lesson at this grade. Try rephrasing it as a classroom topic.",
    editPlan: "Edit plan",
    doneEditing: "Done editing",
    copyPlan: "Copy plan",
    another: "Make another version",
    editHint: "Click any text in the plan to change it. Copy and Print use your edited version.",
    confirmDiscard: "Make a new version? Your edits to this plan will be lost.",
    sumWarning: (sum: number, total: number) => `Adds up to ${sum} min (lesson is ${total} min). Adjust as needed.`,
    examples: [
      { topic: "Photosynthesis", subject: "Science", grade: "7" },
      { topic: "Fractions on a number line", subject: "Maths", grade: "4" },
      { topic: "The water cycle", subject: "Science", grade: "5" },
      { topic: "Persuasive writing techniques", subject: "English", grade: "9" },
    ],
  },
  essay: {
    title: "Essay feedback",
    intro:
      "Paste an essay. Kalem drafts scores on four criteria, notes on exact sentences, and a summary for the student. You change anything you disagree with, then approve it.",
    pasteAria: "Paste the essay",
    essayLabel: "Student essay",
    sample: "Try a sample essay",
    essayPh: "Paste the essay here. Remove the student's name first.",
    help: "Don't include the student's name or personal details. In Türkiye, using AI on student work needs a YAZEK ethics declaration.",
    charsNeeded: (n: number) => `${n} more characters needed`,
    feedbackLang: "Feedback language",
    question: "Essay question",
    questionPh: "e.g. Should schools ban phones?",
    submit: "Get feedback",
    submitting: "Reading the essay…",
    steps: ["Reading the essay", "Scoring 4 criteria against the grade", "Writing margin notes with examples", "Drafting a summary for the student"],
    emptyTitle: "Feedback appears here",
    emptyBody: "Paste an essay (or try the sample) and press “Get feedback”. You'll be able to change every score and note before anything reaches the student.",
    notEssay: "This doesn't look like a student essay, so there's nothing to assess. Paste the student's writing and try again.",
    review: "Review the draft",
    total: "Total",
    forYou: "For you:",
    nextStep: "Next step:",
    scoreAria: (c: string) => `${c} score`,
    notScored: "the AI didn't score this, so set it yourself",
    errorsFound: (n: number) => `Errors found (${n})`,
    changed: (ai: number) => `you changed this from the AI's ${ai}`,
    essayAria: "Essay with margin notes",
    notesAria: "Margin notes",
    noteAria: (id: number, text: string) => `Note ${id}: ${text}`,
    workingWell: "Working well",
    toImprove: "To improve",
    remove: "Remove",
    restore: "Restore",
    removeNote: (n: number) => `Remove note ${n}`,
    restoreNote: (n: number) => `Restore note ${n}`,
    overlap: "(overlaps another note)",
    notFound: "(not found in the text)",
    whyWorks: "Why it works:",
    tryRewrite: "Try:",
    summaryTitle: "Summary for the student",
    summaryHint: "Edit it until it sounds like you. Approve it to copy or print.",
    includeScores: "Include the four scores",
    approve: "Approve feedback",
    copyForStudent: "Copy for the student",
  },
  chat: {
    title: "Study helper",
    intro: "Ask about anything you're learning. Explanations match your grade. Practice problems get hints, one step at a time, so the answer is yours.",
    myGrade: "My grade",
    studying: "What are you studying?",
    studyingPh: "e.g. Maths: equations",
    language: "Language",
    howTitle: "How it helps",
    howBody: "Questions about ideas get a clear explanation. Practice problems get hints, one step at a time, so you learn to solve them yourself.",
    newChat: "Start a new chat",
    chatAria: "Chat",
    banner: "AI study helper.",
    bannerNote: "I can make mistakes, so check with your teacher.",
    inputLabel: "Your message",
    send: "Send",
    stop: "Stop",
    privacy: "Don't share personal details like your full name, school or address.",
  },
};

type Dict = typeof EN;

const TR: Dict = {
  langName: "Türkçe",
  switchTo: "English",
  switchAria: "Dili değiştir",
  forTeachers: "Öğretmenler için",
  forStudents: "Öğrenciler için",
  grade: "Kademe / sınıf",
  gradeOption: (g) => `${g}. sınıf`,
  curriculum: "Öğretim programı",
  moreOptions: "Daha fazla seçenek",
  fewerOptions: "Daha az seçenek",
  optional: "(isteğe bağlı)",
  tryAgain: "Tekrar dene",
  copy: "Kopyala",
  copied: "Kopyalandı",
  copyFailed: "Kopyalanamadı: metni seçip kopyalayın",
  print: "Yazdır",
  draft: "YZ taslağı: kullanmadan önce kontrol edin",
  approved: "Sizin tarafınızdan onaylandı",
  takesTime: "Bu genellikle 10–25 saniye sürer.",
  netError: "Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  genericError: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
  nav: { "lesson-prep": "Ders hazırlığı", "student-chat": "Çalışma asistanı", "essay-grader": "Kompozisyon değerlendirme" },
  footer:
    "Kalem, Madlen Growth Intern başvurusu için hazırlanmış bir case study prototipidir; resmi bir Madlen ürünü değildir. Yapay zekâ çıktısı bir taslaktır: öğrencilerle kullanmadan önce kontrol edin ve öğrenci adı ya da kişisel bilgi girmeyin.",
  home: {
    headline: "İlk taslak bizden. Öğretmek sizden.",
    sub: "Türkiye'deki ve dünyadaki sınıflar için üç küçük yapay zekâ aracı. Bir dakikada ders planlayın, öğrencilerin cevabı kopyalamak yerine düşünmesine yardım edin ve arkasında durabileceğiniz kompozisyon geri bildirimi verin.",
    works: "MEB Maarif, Cambridge ve IB ile çalışır. Türkçe ya da İngilizce cevap verir.",
    demoAria: "Öğrenci kompozisyonuna yapay zekânın düştüğü kenar notu örneği",
    demoBefore: "Sosyal medya gençlerin kendilerini görme biçimini değiştiriyor.",
    demoMark: "Herkes bilir ki insanları mutsuz ediyor.",
    demoAfter: "Bu yazıda okulların öğrencilere sosyal medyayı bilinçli kullanmayı neden öğretmesi gerektiğini açıklayacağım.",
    demoLabel: "Argüman · taslak not",
    demoNote: "“Herkes bilir” kanıtsız bir iddia. Şöyle deneyin: “1.000 genç üzerinde yapılan 2023 tarihli bir anket…”",
    keep: "Notu tut",
    edit: "Düzenle",
    youDecide: "Öğrencinin ne göreceğine siz karar verirsiniz.",
    toolsHeading: "Araçlar",
    open: (name) => `${name} aracını aç`,
    tools: {
      "lesson-prep": {
        summary: "Konuyu ve sınıfı girin. Yarın anlatabileceğiniz bir ders planı alın.",
        gives: ["Öğrenme çıktıları ve anahtar kavramlar", "Her slayt için görsel fikriyle 5 slaytlık taslak", "Tartışma soruları ve kısa quiz"],
      },
      "student-chat": {
        summary: "Bir konuyu sor, sınıf seviyene uygun cevap al. Bir alıştırmada takıldın mı? Adım adım ipucu al.",
        gives: ["Sınıf seviyene uygun açıklamalar", "Alıştırmalar için adım adım ipuçları", "Güvenli ve konuya odaklı sohbet"],
      },
      "essay-grader": {
        summary: "Öğrenci kompozisyonunu yapıştırın. Rubrik puanı, cümle cümle notlar ve düzenleyip paylaşabileceğiniz bir özet alın.",
        gives: ["Gerekçeli 4 kriter puanı", "Örnek düzeltmeli kenar notları", "Onayladığınız, öğrenci dostu bir özet"],
      },
    },
  },
  lesson: {
    title: "Ders hazırlığı",
    intro:
      "Konuyu ve sınıfı girin. Kalem öğrenme çıktılarını, anahtar kavramları, dakika dakika ders akışını, her biri için görsel fikri olan beş slaytı ve tartışma sorularını taslak olarak hazırlar. Derse girmeden önce her şeyi düzenleyebilirsiniz.",
    whatTeaching: "Hangi konuyu anlatacaksınız?",
    topicPh: "ör. Fotosentez, Sayı doğrusunda kesirler, Osmanlı Devleti'nin kuruluşu",
    tryLabel: "Deneyin:",
    exampleChip: (topic, g) => `${topic}, ${g}. sınıf`,
    length: "Ders süresi",
    minutesOpt: (d) => `${d} dakika`,
    planLang: "Plan dili",
    subject: "Ders",
    subjectPh: "ör. Fen Bilimleri",
    anything: "Eklemek istediğiniz bir şey var mı?",
    anythingPh: "ör. Karma seviyeli sınıf, Türkçe öğrenen iki öğrenci var, uygulamalı bir etkinlik ekleyin",
    submit: "Dersimi planla",
    submitting: "Planlanıyor…",
    steps: ["Öğrenme çıktıları ve temel fikir belirleniyor", "Ders akışı zamanlanıyor", "Görsel fikirleriyle 5 slayt hazırlanıyor", "Tartışma soruları yazılıyor"],
    emptyTitle: "Ders planınız burada görünecek",
    emptyBody: "Bir konu yazın, sınıfı seçin ve “Dersimi planla”ya basın. Plandaki her şeyi kullanmadan önce düzenleyebilirsiniz.",
    notAppropriate: "Bu konu bu sınıf düzeyinde bir ders için uygun görünmüyor. Bir sınıf konusu olarak yeniden yazmayı deneyin.",
    editPlan: "Planı düzenle",
    doneEditing: "Düzenlemeyi bitir",
    copyPlan: "Planı kopyala",
    another: "Yeni versiyon oluştur",
    editHint: "Değiştirmek için plandaki herhangi bir yazıya tıklayın. Kopyala ve Yazdır düzenlenmiş halini kullanır.",
    confirmDiscard: "Yeni versiyon oluşturulsun mu? Bu plandaki düzenlemeleriniz kaybolacak.",
    sumWarning: (sum, total) => `Toplam ${sum} dk (ders ${total} dk). Gerekirse ayarlayın.`,
    examples: [
      { topic: "Fotosentez", subject: "Fen Bilimleri", grade: "7" },
      { topic: "Sayı doğrusunda kesirler", subject: "Matematik", grade: "4" },
      { topic: "Su döngüsü", subject: "Fen Bilimleri", grade: "5" },
      { topic: "İkna edici yazma teknikleri", subject: "Türkçe", grade: "9" },
    ],
  },
  essay: {
    title: "Kompozisyon değerlendirme",
    intro:
      "Bir kompozisyon yapıştırın. Kalem dört kriterde puan, tek tek cümlelere notlar ve öğrenci için bir özet taslağı hazırlar. Katılmadığınız her şeyi değiştirir, sonra onaylarsınız.",
    pasteAria: "Kompozisyonu yapıştırın",
    essayLabel: "Öğrenci kompozisyonu",
    sample: "Örnek kompozisyonla dene",
    essayPh: "Kompozisyonu buraya yapıştırın. Önce öğrencinin adını silin.",
    help: "Öğrencinin adını veya kişisel bilgilerini eklemeyin. Türkiye'de öğrenci ürünlerinin yapay zekâ ile değerlendirilmesi YAZEK etik beyanı gerektirir.",
    charsNeeded: (n) => `${n} karakter daha gerekli`,
    feedbackLang: "Geri bildirim dili",
    question: "Kompozisyon sorusu",
    questionPh: "ör. Okullarda telefon yasaklanmalı mı?",
    submit: "Geri bildirim al",
    submitting: "Kompozisyon okunuyor…",
    steps: ["Kompozisyon okunuyor", "4 kriter sınıf düzeyine göre puanlanıyor", "Örnekli kenar notları yazılıyor", "Öğrenci için özet hazırlanıyor"],
    emptyTitle: "Geri bildirim burada görünecek",
    emptyBody: "Bir kompozisyon yapıştırın (veya örneği deneyin) ve “Geri bildirim al”a basın. Öğrenciye bir şey ulaşmadan önce her puanı ve notu değiştirebileceksiniz.",
    notEssay: "Bu bir öğrenci kompozisyonuna benzemiyor, değerlendirilecek bir şey yok. Öğrencinin yazısını yapıştırıp tekrar deneyin.",
    review: "Taslağı inceleyin",
    total: "Toplam",
    forYou: "Sizin için:",
    nextStep: "Sonraki adım:",
    scoreAria: (c) => `${c} puanı`,
    notScored: "yapay zekâ bunu puanlamadı, puanı siz belirleyin",
    errorsFound: (n) => `Bulunan hatalar (${n})`,
    changed: (ai) => `yapay zekânın verdiği ${ai} puanını değiştirdiniz`,
    essayAria: "Kenar notlarıyla kompozisyon",
    notesAria: "Kenar notları",
    noteAria: (id, text) => `Not ${id}: ${text}`,
    workingWell: "İyi giden",
    toImprove: "Geliştirilecek",
    remove: "Kaldır",
    restore: "Geri al",
    removeNote: (n) => `${n}. notu kaldır`,
    restoreNote: (n) => `${n}. notu geri al`,
    overlap: "(başka bir notla çakışıyor)",
    notFound: "(metinde bulunamadı)",
    whyWorks: "Neden işe yarıyor:",
    tryRewrite: "Şöyle deneyin:",
    summaryTitle: "Öğrenci için özet",
    summaryHint: "Sizin sesiniz gibi olana kadar düzenleyin. Kopyalamak veya yazdırmak için onaylayın.",
    includeScores: "Dört puanı da ekle",
    approve: "Geri bildirimi onayla",
    copyForStudent: "Öğrenci için kopyala",
  },
  chat: {
    title: "Çalışma asistanı",
    intro: "Öğrendiğin her şeyi sorabilirsin. Açıklamalar sınıf seviyene uygun. Alıştırmalarda adım adım ipucu alırsın; cevabı sen bulursun.",
    myGrade: "Sınıfım",
    studying: "Ne çalışıyorsun?",
    studyingPh: "ör. Matematik: denklemler",
    language: "Dil",
    howTitle: "Nasıl yardım eder?",
    howBody: "Kavram sorularına net bir açıklama alırsın. Alıştırma sorularında ipuçları adım adım gelir, böylece çözmeyi kendin öğrenirsin.",
    newChat: "Yeni sohbet başlat",
    chatAria: "Sohbet",
    banner: "Yapay zekâ çalışma asistanı.",
    bannerNote: "Hata yapabilirim, öğretmenine de danış.",
    inputLabel: "Mesajın",
    send: "Gönder",
    stop: "Durdur",
    privacy: "Tam adın, okulun veya adresin gibi kişisel bilgilerini paylaşma.",
  },
};

export const DICT: Record<UiLang, Dict> = { en: EN, tr: TR };

const Ctx = createContext<{ lang: UiLang; setLang: (l: UiLang) => void }>({ lang: "en", setLang: () => {} });

// The saved choice lives in localStorage; useSyncExternalStore reads it without a
// render-then-correct effect, renders English on the server, and syncs across tabs.
const CHANGE_EVENT = "kalem-ui-lang-change";

function readSavedLang(fallback: UiLang): UiLang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "tr" || saved === "en" ? saved : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * `initialLang` comes from the cookie on the server, so the first HTML is already
 * in the right language (no English flash for Turkish users).
 */
export function LanguageProvider({ children, initialLang = "en" }: { children: ReactNode; initialLang?: UiLang }) {
  const lang = useSyncExternalStore(subscribe, () => readSavedLang(initialLang), () => initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: UiLang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    // Cookie lets the server render the next page in this language.
    document.cookie = `${STORAGE_KEY}=${l}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useUi() {
  const { lang, setLang } = useContext(Ctx);
  return { lang, setLang, t: DICT[lang] };
}

/** Grade options grouped by school stage (İlkokul / Ortaokul / Lise). */
export function gradeGroupsFor(lang: UiLang) {
  return STAGES.map((s) => ({
    label: STAGE_NAMES[lang][s.stage],
    options: s.grades.map((g) => ({ value: g, label: DICT[lang].gradeOption(g) })),
  }));
}

/** The UI language, for sending to the server with requests. */
export function currentUiLang(): UiLang {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "tr" ? "tr" : "en";
}
