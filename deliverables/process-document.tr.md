# Süreç dokümanı

Canlı uygulama: kalem-case-study.vercel.app
Kod: github.com/soyleremo3/madlen-case-study
Resmi bir Madlen ürünüyle karıştırılmasın diye prototipe "Kalem" adını verdim.

## Hangi yapay zekâ araçlarını, ne için kullandım?
Neredeyse her şeyi Claude Code (Claude Opus) ile yaptım. Madlen'i ve rakiplerini araştırmak, işi planlamak, Next.js kodunu yazmak, prompt'ları yazıp test etmek ve sonuçları kontrol etmek için kullandım. Büyük sorular için ayrı Claude ajanlarını paralel çalıştırdım. Biri öğretim araştırmasına (ipucu merdivenleri, MEB rubrik düzeyleri), biri AI SDK dokümantasyonunun kontrolüne, biri de MagicSchool, Brisk ve Khanmigo'nun kullanıcı deneyimi karşılaştırmasına baktı. Son bir ajan bitmiş kodu inceledi. Uygulamanın kendisi Google'ın Gemini API'si (ücretsiz katman) ile çalışıyor. Instagram gönderisi için Canva AI'ı da denedim.

## Nerede araç değiştirdim, neden?
- Canva AI'dan koda. Canva tek sayfalık tasarımlar verdi, Türkçe metnimi İngilizce dolgu metniyle değiştirdi ve yanlış bir formül yazdı. Bunun yerine görselleri HTML/CSS ile yapıp Chrome ile dışa aktardım.
- Düz web isteklerinden gerçek tarayıcıya. Khanmigo ve MagicSchool yardım merkezleri otomatik istekleri engelledi, ben de onları bir tarayıcıda okudum.
- Gemini Flash'tan Flash Lite'a. Test günü Flash "yoğunluk" hataları verdi ve günde sadece 20 ücretsiz isteğe izin veriyor. Artık önce Flash Lite çalışıyor, Flash yedek.

## Hâlâ pürüzlü olan ne, sırada ne var?
- Ücretsiz API günde yaklaşık 500 isteğe izin veriyor ve Google ücretsiz katman verilerini kullanabiliyor. Bu yüzden sadece uydurma kompozisyonlarla test ettim. Gerçek bir sürüm Madlen'in AB'de barındırılan altyapısında çalışmalı.
- Küçük model bazen bir dil bilgisi hatasını kaçırıyor ya da kriterlere benzer puanlar veriyor. Bir yazım denetimi adımı ve puanlama kuralları ekledim. Sırada, öğretmenlerin daha önce puanladığı kompozisyonlarla test etmek var.
- Hesap yok, hiçbir şey kaydedilmiyor. Sırada planları kaydetmek ve bir quiz'i doğrudan sınıfa göndermek var.
- Araçlar Maarif terimlerini kullanıyor ama gerçek kazanım kodlarıyla eşleşmiyor. Bunun için Madlen'in müfredat verisi gerekiyor.

## Hangi UI/UX kararlarını aldım, neden?
- Kontrol öğretmende kalıyor. Ders planları, quizler ve kompozisyon geri bildirimleri yapay zekâ taslağı olarak işaretli; her puan ve not düzenlenebiliyor. Kompozisyon geri bildirimi ancak öğretmen onayladıktan sonra kopyalanabiliyor. Bu, Madlen'in kendi tutumuna ve MEB'in insan gözetimi kuralına uyuyor.
- Her rengin tek bir anlamı var. Turuncu öğretmenin eylemleri, mor yapay zekânın önerileri için. Kompozisyon notları, kenara yazılmış yorumlar gibi ilgili cümlenin yanında duruyor.
- İlk kullanım saniyeler sürüyor. Sadece konu ve sınıf zorunlu, her araçta denenecek örnekler var.
- Çalışma asistanı öğrenme için tasarlandı. Alıştırma sorularında cevaptan önce ipucu veriyor. Yazma ödevlerinde hazır metin yerine bir taslak veriyor. Öğrenci kendine zarar vermekten bahsederse, onu güvendiği bir yetişkine yönlendiren sabit bir cevap veriyor.
- Türk sınıflarına uygun. Arayüz Türkçe ve İngilizce çalışıyor, sınıflar İlkokul, Ortaokul ve Lise olarak gruplu. Hata mesajları ne yapılması gerektiğini söylüyor.
