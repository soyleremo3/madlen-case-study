# Süreç dokümanı

Canlı uygulama: kalem-case-study.vercel.app
Kod: github.com/soyleremo3/madlen-case-study
Resmi bir Madlen ürünüyle karıştırılmasın diye prototipe "Kalem" adını verdim.

## Hangi yapay zekâ araçlarını, ne için kullandım?
Neredeyse her şeyi Claude Code (Claude Opus) ile yaptım. Madlen'i ve rakiplerini araştırmak, işi planlamak, Next.js kodunu yazmak, prompt'ları yazıp test etmek ve sonuçları kontrol etmek için kullandım. Büyük sorular için ayrı Claude ajanlarını paralel çalıştırdım: biri öğretim araştırmasına (ipucu merdivenleri, MEB rubrik düzeyleri), biri AI SDK dokümantasyonuna, biri de MagicSchool, Brisk ve Khanmigo'nun kullanıcı deneyimi karşılaştırmasına baktı. Son bir ajan bitmiş kodu inceledi. Uygulamanın kendisi Google'ın Gemini API'si ile çalışıyor.

## Nerede araç değiştirdim, neden?
Instagram gönderisi için önce Canva AI'ı denedim. Tek sayfalık tasarımlar verdi, Türkçe metnimi İngilizce dolgu metniyle değiştirdi ve yanlış bir formül yazdı; ben de slaytları HTML/CSS ile yapıp Chrome ile dışa aktardım. Uygulamada Gemini Flash ile başladım, ama test günü "yoğunluk" hataları verdi ve ücretsiz katmanda günde sadece 20 isteğe izin veriyor. Artık önce Flash Lite çalışıyor, Flash yedekte.

## Sırada neyi düzeltirim?
Üç araç şu an birbirinden bağımsız çalışıyor. Ders planları, quizler ve kompozisyon değerlendirmeleri kaydedilmiyor ve bir quiz henüz sınıfa gönderilemiyor. Sırada bunları birbirine bağlamak var: öğretmen dersi planlayıp quizi öğrencilere gönderebilmeli ve sonuçları tek yerde görebilmeli. Bu, Madlen'in UVP'sinin merkezindeki bağlantılı döngü.

## Hangi UI/UX kararlarını aldım, neden?
Öğrencinin ne göreceğine öğretmen karar veriyor. Ders planları, quizler ve kompozisyon geri bildirimleri yapay zekâ taslağı olarak işaretli, her puan ve not düzenlenebiliyor ve kompozisyon geri bildirimi ancak öğretmen onayladıktan sonra kopyalanabiliyor. Madlen de böyle çalışıyor; MEB de yapay zekâ üzerinde insan gözetimi şartı koyuyor.
Turuncu öğretmenin eylemlerini, mor yapay zekânın önerilerini gösteriyor. Kompozisyon notları, kenara yazılmış yorumlar gibi ilgili cümlenin yanında duruyor.
Sadece konu ve sınıf zorunlu ve her araçta denenecek örnekler var; ilk kez kullanan biri bir dakikadan kısa sürede sonuç alıyor.
Çalışma asistanı öğrenciyi düşündürmek için tasarlandı. Alıştırma sorularında cevaptan önce ipucu, yazma ödevlerinde bir taslak veriyor. Öğrenci kendine zarar vermekten bahsederse, onu güvendiği bir yetişkine yönlendiren sabit bir mesajla cevap veriyor.
Arayüz Türkçe ve İngilizce çalışıyor, sınıflar İlkokul, Ortaokul ve Lise olarak gruplu ve hata mesajları ne yapılması gerektiğini söylüyor.
