@echo off
title Safe Exam Browser Kiosk Mode Launcher
color 0A
echo ========================================================
echo   SAFE EXAM BROWSER (SEB) & EXAMBRO KIOSK LAUNCHER
echo ========================================================
echo.

:: ========================================================
:: PENGATURAN ALAMAT UJIAN (LOKAL ATAU VERCEL DOMAIN)
:: Ganti URL di bawah dengan domain Vercel Anda jika sudah deploy
:: Contoh: set "EXAM_URL=https://seb-cbt-portal.vercel.app"
:: ========================================================
set "EXAM_URL=http://localhost:8080/"

echo Membuka Portal Ujian: %EXAM_URL%
echo Mengunci peramban dalam Kiosk Mode Layar Penuh...
echo Password keluar resmi: 1234567890
echo.

set "BROWSER_FLAGS=--kiosk %EXAM_URL% --edge-kiosk-type=fullscreen --no-first-run --disable-pinch --disable-features=TouchpadOverscrollHistoryNavigation,TranslateUI --overscroll-history-navigation=0"

:: Jalankan Microsoft Edge dalam Mode Kiosk
where msedge >nul 2>&1
if %errorlevel% equ 0 (
    start msedge.exe %BROWSER_FLAGS%
    exit
)

:: Jalankan Google Chrome dalam Mode Kiosk
where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start chrome.exe %BROWSER_FLAGS%
    exit
)

:: Fallback path
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" %BROWSER_FLAGS%
    exit
)

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" %BROWSER_FLAGS%
    exit
)

start "" "%EXAM_URL%"
exit
