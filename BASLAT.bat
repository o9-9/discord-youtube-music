@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║       🎵 YOUTUBE MUSIC DISCORD RPC BAŞLATICI             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Kurulum kontrolü
if not exist "discord-app\node_modules" (
    echo ⚠️  İlk kurulum gerekli!
    echo.
    echo 💡 Kurulum başlatılıyor...
    cd discord-app
    call HIZLI-KURULUM.bat
    exit /b
)

REM Masaüstü uygulamasını başlat
echo 🚀 Uygulama başlatılıyor...
cd discord-app
start "" npm start

echo ✅ Uygulama başlatıldı! (Sistem tepsisinde)
echo.
echo 💡 Şimdi yapılacaklar:
echo    1. YouTube Music'e git: https://music.youtube.com
echo    2. Şarkı çal
echo    3. Discord'ta durumunu gör! 🎵
echo.

REM YouTube Music'i aç
set /p open_yt="YouTube Music'i açmak istiyor musunuz? (E/H): "
if /i "%open_yt%"=="E" (
    start "" "https://music.youtube.com"
)

echo.
echo 🎉 Hazır! Keyifli dinlemeler!
timeout /t 5
exit
