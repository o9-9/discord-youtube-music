@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║    🏗️ YOUTUBE MUSIC DISCORD RPC - KURULUM DOSYASI OLUŞTUR    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Node.js kontrolü
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo 💡 https://nodejs.org adresinden Node.js indirin
    pause
    exit /b 1
)

echo ✅ Node.js bulundu
echo.

REM Bağımlılıkları yükle
if not exist "node_modules" (
    echo 📦 Bağımlılıklar yükleniyor...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Bağımlılık yükleme hatası!
        pause
        exit /b 1
    )
    echo.
)

REM electron-builder kontrolü
if not exist "node_modules\electron-builder" (
    echo 📦 Electron Builder yükleniyor...
    npm install electron-builder --save-dev
    if %errorlevel% neq 0 (
        echo ❌ Electron Builder yükleme hatası!
        pause
        exit /b 1
    )
    echo.
)

echo 🔨 Windows kurulum dosyası oluşturuluyor...
echo ⏳ Bu işlem 5-10 dakika sürebilir...
echo.

REM Build işlemi
npm run build-win

if %errorlevel% == 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║                                                              ║
    echo ║                    ✅ KURULUM HAZIR!                         ║
    echo ║                                                              ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.
    echo 🎉 Kurulum dosyası başarıyla oluşturuldu!
    echo 📁 Konum: dist klasörü
    echo.
    
    REM dist klasörünü aç
    if exist "dist" (
        echo 📂 Dist klasörü açılıyor...
        start "" "dist"
        echo.
        echo 💡 .exe dosyasını çalıştırarak uygulamayı kurabilirsiniz
        echo 🖥️ Masaüstü kısayolu otomatik oluşturulacak
        echo 📱 Başlat menüsüne eklenecek
    )
    
) else (
    echo.
    echo ❌ Build hatası!
    echo 💡 Hata detayları yukarıda gösterildi
    echo.
    echo 🔧 Olası çözümler:
    echo    • npm cache clean --force
    echo    • node_modules klasörünü silin ve npm install yapın
    echo    • Antivirus yazılımını geçici kapatın
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 📋 KURULUM SONRASI YAPILACAKLAR:
echo.
echo 1. 📦 .exe dosyasını çalıştırın
echo 2. 🎮 Discord CLIENT_ID'yi ayarlayın (gerekirse)
echo 3. 🌐 Chrome uzantısını yükleyin
echo 4. 🎵 YouTube Music'te şarkı çalın
echo.
echo 💡 Detaylı rehber: DESKTOP-APP-REHBER.md
echo ═══════════════════════════════════════════════════════════════
echo.
pause