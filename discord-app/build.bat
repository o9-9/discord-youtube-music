@echo off
title Build YouTube Music RPC
color 0B

echo ========================================
echo  YouTube Music RPC - Build
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Node.js kontrol ediliyor...
node --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi!
    echo Lutfen Node.js yukleyin: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js bulundu!
echo.

echo [2/4] Bagimliliklari kontrol ediliyor...
if not exist "node_modules" (
    echo Bagimliliklari yukleniyor...
    call npm install
    echo.
)
echo Bagimliliklari hazir!
echo.

echo [3/4] Build baslatiliyor...
echo Bu islem 2-5 dakika surebilir, lutfen bekleyin...
echo.
call npm run build-win
echo.

if errorlevel 1 (
    echo.
    echo [HATA] Build basarisiz!
    echo.
    pause
    exit /b 1
)

echo [4/4] Build tamamlandi!
echo.
echo ========================================
echo  Cikti Dosyalari:
echo ========================================
echo.
echo Kurulum: dist\YouTube Music RPC Setup.exe
echo Portable: dist\win-unpacked\
echo.
echo ========================================

if exist "dist\YouTube Music RPC Setup.exe" (
    echo.
    echo Setup.exe dosyasi olusturuldu!
    echo.
    set /p open="Setup.exe'yi acmak ister misiniz? (E/H): "
    if /i "%open%"=="E" (
        start "" "dist\YouTube Music RPC Setup.exe"
    )
)

echo.
pause
