# 🎵 YouTube Music Discord Rich Presence

YouTube Music'te dinlediğiniz şarkıları anlık olarak Discord profilinizde gösteren bir tarayıcı uzantısı ve masaüstü köprü uygulamasıdır.

![Discord Presence](https://img.shields.io/badge/Discord-Rich%20Presence-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![YouTube Music](https://img.shields.io/badge/YouTube%20Music-Streaming-FF0000?style=for-the-badge&logo=youtube-music&logoColor=white)

## ✨ Özellikler

- 🎶 **Anlık Senkronizasyon:** Şarkı değiştiğinde Discord durumunuz saniyeler içinde güncellenir.
- 🖼️ **Albüm Kapakları:** Dinlediğiniz şarkının albüm kapağı Discord'da gösterilir.
- ⏯️ **Durum Belirteçleri:** Şarkının oynatılıyor veya duraklatılmış olduğunu gösteren simgeler.
- 🕒 **Zaman Sayacı:** Şarkının ne kadar süredir çaldığını gösteren canlı sayaç.
- 🎨 **Modern Arayüz:** Kullanımı kolay ve şık bir kontrol paneli.
- 🚀 **Düşük Kaynak Kullanımı:** Arka planda sessizce ve hafif bir şekilde çalışır.

## 🚀 Kurulum

### 1. Masaüstü Uygulaması (Bridge)
Bu uygulama, tarayıcıdan gelen bilgileri Discord'a iletir.

1. `discord-app` klasörüne gidin.
2. `HIZLI-KURULUM.bat` dosyasını çalıştırın.
3. Gerekli bağımlılıklar otomatik olarak yüklenecek ve uygulama başlatılacaktır.

### 2. Chrome Uzantısı
Bu uzantı, YouTube Music web sayfasından şarkı bilgilerini çeker.

1. Tarayıcınızda (Chrome, Edge, Brave vb.) `chrome://extensions/` adresine gidin.
2. Sağ üst köşedeki **Geliştirici Modu**'nu aktif edin.
3. **Paketlenmemiş öğe yükle** butonuna tıklayın.
4. Bu projenin **ana klasörünü** seçin.

## 🛠️ Kullanım

1. Önce masaüstü uygulamasını (`discord-app/HIZLI-KURULUM.bat` veya ana klasördeki `BASLAT.bat`) başlatın.
2. YouTube Music'i açın ve bir şarkı başlatın.
3. Discord profilinizde şarkı bilgilerinin göründüğünü kontrol edin!

## 🔧 Yapılandırma

Kendi Discord uygulamanızı kullanmak isterseniz:
1. [Discord Developer Portal](https://discord.com/developers/applications) üzerinden yeni bir uygulama oluşturun.
2. `discord-app/main.js` dosyasındaki `CLIENT_ID` değişkenine kendi `Application ID`nizi yapıştırın.

## 🤝 Katkıda Bulunma

Hata bildirimleri ve özellik önerileri için Issue açabilir veya Pull Request gönderebilirsiniz.

## ⚖️ Lisans

Bu proje Apache 2.0 lisansı ile lisanslanmıştır.