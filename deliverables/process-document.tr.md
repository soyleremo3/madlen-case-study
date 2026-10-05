# Kalem: süreç dokümanı

**Canlı uygulama:** [LIVE URL] · **Kod:** github.com/soyleremo3/madlen-case-study
Tek sitede üç araç: Ders hazırlığı, Çalışma asistanı ve Kompozisyon değerlendirme. Adı "Kalem" ve vaka çalışması prototipi olarak etiketli; böylece resmi bir Madlen ürünüyle karıştırılmıyor.

## Yapay zekâ araçları: neyi, ne için kullandım
- **Claude Code (Claude Opus)** ana geliştirme ortağımdı. Madlen'i ve rakipleri yerleşik bir tarayıcıda araştırmak, planlamak, kodun tamamını yazmak (Next.js 16, Vercel AI SDK, Tailwind), prompt'ları tasarlayıp geliştirmek ve test betikleri yazmak için kullandım.
- **Claude alt ajanları** odaklı işleri paralel yaptı. Geliştirmeden önce üç araştırma ajanı pedagojiyi (ipucu merdivenleri, MEB rubrik düzeyleri, geriye dönük tasarım), teknolojiyi (yeni AI SDK v7 API'sini Context7 dokümanlarıyla doğrulayıp kod örneklerini tip kontrolünden geçirdiler) ve MagicSchool, Brisk, Khanmigo ile Madlen'in UX karşılaştırmasını ele aldı. Yayından önce bağımsız, salt okunur bir inceleme ajanı kodu denetledi.
- **Google Gemini API (ücretsiz katman)** uygulamayı çalıştırıyor. Flash Lite modellerini yedekli bir zincirle tek bir sunucu modülü üzerinden kullanıyorum; Madlen'in kendi sağlayıcısına geçmek tek satır değiştirmek demek.
- **Canva AI** Instagram gönderisi için denendi (aşağıya bakın).

## Araç değiştirdiğim yerler ve nedenleri
- **Web'den çekme → yerleşik tarayıcı.** Yardım merkezleri (Khanmigo, MagicSchool) düz çekmeyi engelledi ya da cevapları kapalı bölümlerde sakladı. Gerçek bir tarayıcı bunları okuyabildi.
- **Canva AI → kodla üretilen gönderi.** Canva tek sayfalık tasarımlar verdi, maskotu kullanmadı, Türkçe metnimi İngilizce dolgu metniyle değiştirdi ve yanlış bir formül yazdı. Headless Chrome ile işlenen HTML/CSS; birebir metin, gerçek marka varlıkları ve 5 slayt sağladı.
- **Gemini Flash → önce Flash Lite.** Test günü Flash "503 high demand" hatası verdi ve ücretsiz katmanda günde yalnızca 20 isteği var. Artık önce Lite modeller deneniyor; model başına 25 sn zaman aşımı ve toplam 50 sn sınır var.

## Hâlâ pürüzlü olanlar ve sıradaki düzeltmeler
- **Ücretsiz katman sınırları:** günde yaklaşık 500 istek. Google ücretsiz katman verilerini kullanabildiği için yalnızca kurgusal kompozisyonlarla test ettim. Sıradaki: Madlen'in AB'de barındırılan, KVKK uyumlu altyapısı.
- **Model kalitesi:** küçük modeller bazen dil bilgisi hatalarını kaçırıyor ya da aynı puanı tekrarlıyor. Puanlamadan önce bir yazım denetimi adımı ve tüm puan aralığını kullanma kuralı ekledim; öğretmen her zaman gözden geçiriyor. Sıradaki: önceden puanlanmış kompozisyonlarla bir kalibrasyon seti.
- **Henüz hesap ya da kayıt yok.** Planlar ve geri bildirimler tarayıcı oturumunda duruyor. Sıradaki: kaydetme ve bir quiz'i doğrudan sınıfa gönderme. Bu, Madlen'in "bağlantılı döngüsü".
- **Müfredat derinliği:** araçlar Maarif Modeli terimlerini kullanıyor ama kazanım kodu uydurmuyor. Sıradaki: Madlen'in veritabanından gerçek kazanım eşleştirmesi.

## Bilinçli UI/UX kararları
- **Son söz her zaman öğretmende.** Her yapay zekâ çıktısında "YZ taslağı" etiketi var. Kompozisyon geri bildirimi ancak "Geri bildirimi onayla"dan sonra kopyalanıp yazdırılabiliyor; her puan ve not düzenlenebiliyor. Bu, Madlen'in kendi duruşunu ve MEB'in insan gözetimi ilkesini yansıtıyor.
- **Renklerin anlamı var.** Turuncu öğretmenin eylemlerini, mor yapay zekânın sesini gösteriyor; kenar boşluğundaki ikinci bir kalem gibi. Kompozisyon notları ilgili cümlenin hemen yanında duruyor. Renkler Madlen markasına yakın; turuncu metinler WCAG AA kontrastını geçmek için daha koyu bir ton kullanıyor.
- **Hızlı ilk kullanım.** Yalnızca konu ve sınıf zorunlu; örnek konu çipleri ve "Örnek kompozisyonla dene" düğmesi var. Yüklenirken boş bir döner simge yerine adım adım ne yapıldığı gösteriliyor.
- **Cevap değil öğrenme.** Çalışma asistanı alıştırma sorularında 4 adımlı ipucu merdiveni kullanıyor, yazma ödevlerinde hazır metin yerine taslak veriyor ve öğrenci kendine zarar vermekten söz ederse güvendiği bir yetişkine ve 112'ye yönlendiren sabit bir mesajla cevap veriyor.
- **Türkçe öncelikli, gerçek kullanıma hazır.** TR/EN arayüz var; sınıflar İlkokul, Ortaokul ve Lise olarak gruplu. Hata mesajları ne yapılacağını söylüyor ("günlük limit doldu, 10:00'da yenilenir"). Telefon genişliğinde ve yalnızca klavyeyle çalışıyor.
