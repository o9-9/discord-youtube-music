@echo off
chcp 65001 >nul
color 0B
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║       🚀 YOUTUBE MUSIC DISCORD RPC - HIZLI KURULUM          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 Bu script uygulamayı hızlıca kurup çalıştıracak!
echo.
echo ✅ Yapılacaklar:
echo    • Bağımlılık kurulumu
echo    • Uygulama başlatma
echo    • Chrome uzantısı rehberi
echo.
set /p confirm="Devam etmek istiyor musunuz? (E/H): "
if /i not "%confirm%"=="E" (
    echo ❌ Kurulum iptal edildi.
    pause
    exit /b
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 📋 ADIM 1: SİSTEM KONTROLÜ
echo ═══════════════════════════════════════════════════════════════

REM Node.js kontrolü
echo 🔍 Node.js kontrol ediliyor...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo.
    echo 💡 ÇÖZÜM:
    echo    1. https://nodejs.org adresine gidin
    echo    2. "LTS" sürümünü indirin ve kurun
    echo    3. Bilgisayarı yeniden başlatın
    echo    4. Bu scripti tekrar çalıştırın
    echo.
    set /p open_nodejs="Node.js indirme sayfasını açmak istiyor musunuz? (E/H): "
    if /i "%open_nodejs%"=="E" (
        start "" "https://nodejs.org"
    )
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js bulundu: %NODE_VERSION%

echo.
echo ═══════════════════════════════════════════════════════════════
echo 📦 ADIM 2: BAĞIMLILIK KURULUMU
echo ═══════════════════════════════════════════════════════════════

REM node_modules kontrolü
if not exist "node_modules" (
    echo 📦 Bağımlılıklar kuruluyor...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Bağımlılık kurulum hatası!
        pause
        exit /b 1
    )
    echo ✅ Bağımlılıklar kuruldu
) else (
    echo ✅ Bağımlılıklar zaten kurulu
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🎮 ADIM 3: DISCORD AYARLARI
echo ═══════════════════════════════════════════════════════════════

echo 💡 Discord CLIENT_ID kontrolü...
echo.
echo Mevcut CLIENT_ID: 1461815607673749504
echo.
echo 🔧 Kendi CLIENT_ID'nizi kullanmak isterseniz:
echo    1. https://discord.com/developers/applications
echo    2. "New Application" oluşturun
echo    3. APPLICATION ID'yi kopyalayın
echo    4. main.js dosyasında değiştirin
echo.
set /p setup_discord="Discord Developer Portal'ı açmak istiyor musunuz? (E/H): "
if /i "%setup_discord%"=="E" (
    echo 🌐 Discord Developer Portal açılıyor...
    start "" "https://discord.com/developers/applications"
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🚀 ADIM 4: UYGULAMA BAŞLATMA
echo ═══════════════════════════════════════════════════════════════

echo 🎵 Desktop App başlatılıyor...
echo 💡 Modern Discord temalı arayüz açılacak
echo.

REM Uygulamayı başlat
start "" npm start

REM 3 saniye bekle
timeout /t 3 /nobreak >nul

echo ✅ Desktop App başlatıldı!
echo 📍 Sistem tepsisinde ikon arayın

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🌐 ADIM 5: CHROME UZANTISI
echo ═══════════════════════════════════════════════════════════════

echo 💡 Chrome uzantısını manuel kurmanız gerekiyor:
echo.
echo    1. Chrome'da chrome://extensions/ adresine gidin
echo    2. Sağ üstte "Geliştirici modu" aktif edin
echo    3. "Paketlenmemiş uzantı yükle" tıklayın
echo    4. Ana klasörü seçin: %CD%\..
echo.
set /p open_chrome="Chrome uzantı sayfasını açmak istiyor musunuz? (E/H): "
if /i "%open_chrome%"=="E" (
    echo 🌐 Chrome uzantı sayfası açılıyor...
    start "" "chrome://extensions/"
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🧪 ADIM 6: TEST
echo ═══════════════════════════════════════════════════════════════

echo 💡 Test için:
echo    1. YouTube Music'e gidin
echo    2. Şarkı çalın
echo    3. Discord'ta durumunuzu kontrol edin
echo.
set /p open_youtube="YouTube Music'i açmak istiyor musunuz? (E/H): "
if /i "%open_youtube%"=="E" (
    echo 🌐 YouTube Music açılıyor...
    start "" "https://music.youtube.com"
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║                    ✅ KURULUM TAMAMLANDI!                    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎉 YouTube Music Discord RPC başarıyla kuruldu!
echo.
echo 📋 DURUM:
echo    ✅ Desktop App çalışıyor (Discord temalı arayüz)
echo    ✅ Sistem tepsisinde ikon var
echo    ⏳ Chrome uzantısını manuel kurun
echo    ⏳ YouTube Music'te şarkı çalın
echo.
echo 🎨 YENİ ÖZELLİKLER:
echo    • Discord temalı modern arayüz
echo    • Animasyonlu durum göstergeleri
echo    • Canlı şarkı bilgisi
echo    • Oynatma animasyonları
echo    • Hızlı erişim butonları
echo.
echo 💡 YARDIM:
echo    • DESKTOP-APP-REHBER.md - Detaylı kullanım
echo    • build-installer.bat - .exe kurulum dosyası oluştur
echo.
echo 🎵 Keyifli dinlemeler!
echo.
pause