ORBITAL ROCKET LAB — İNTERNET ÜZERİNDEN ÇOK OYUNCULU KURULUM

Bu sürüm oyun sayfasını ve WebSocket çok oyunculu sunucusunu aynı adreste çalıştırır. HTTPS sayfası WSS bağlantısı kullanır; oyuncular IP/port yazmaz.

RENDER ÜZERİNDE YAYINA ALMA (ücretsiz plan mevcut olabilir; uyku/başlangıç gecikmesi olabilir):
1. Bu ZIP'i bilgisayarına çıkar.
2. İçindeki dosyaları bir GitHub deposuna yükle (orbital_rocket_lab_lan_fixed.html, server.js, package.json, render.yaml).
3. Render.com hesabı aç ve New + > Blueprint seç.
4. GitHub deposunu bağla; Render render.yaml dosyasını okuyup servisi oluşturur.
5. Deploy tamamlanınca Render sana https://....onrender.com biçiminde bir adres verir.
6. Bu adresi arkadaşlarına gönder. Herkes aynı adresi açar, farklı oyuncu adı yazar ve ÇEVRİMİÇİ BAĞLAN'a basar.

ÖNEMLİ:
- Bu dosyalar sunucuyu yayına hazırlar; ben senin Render/GitHub hesabına giriş yapıp senin adına internette yayınlayamam.
- Herkese açık bağlantı için Render'da servis dağıtımı tamamlanmış olmalı.
- Ücretsiz barındırma servisleri boşta kalınca uykuya geçebilir; ilk bağlantı gecikebilir.
- Sunucu oyuncu konumlarını ve roket modüllerini aktarır. Her oyuncunun uçuş fiziği kendi tarayıcısında çalışır; bu, tam senkronize ortak fizik değildir.
