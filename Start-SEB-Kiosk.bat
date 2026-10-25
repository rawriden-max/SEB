@echo off
title Safe Exam Browser Kiosk Mode Launcher
color 0A
echo ========================================================
echo   SAFE EXAM BROWSER (SEB) & EXAMBRO KIOSK LAUNCHER
echo ========================================================
echo.

:: ========================================================
:: PENGATURAN ALAMAT UJIAN (LOKAL ATAU VERCEL DOMAIN)
:: Ganti URL di bawah dengan domain Vercel Anda setelah deploy
:: Contoh: set "EXAM_URL=https://seb-cbt-portal.vercel.app"
:: ========================================================
set "EXAM_URL=http://localhost:8080/"

echo Membuka Portal Ujian: %EXAM_URL%
echo.
echo [1/2] Menonaktifkan gestur usap 3 jari & 4 jari di laptop Windows...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v ThreeFingerSwipesEnabled /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v FourFingerSwipesEnabled /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v EnableEdgy /t REG_DWORD /d 0 /f >nul 2>&1
echo [SUKSES] Fitur usap 3 jari (Task View) & 4 jari (Ganti Desktop) dimatikan!
echo.
echo [2/2] Mengunci peramban dalam Kiosk Mode Layar Penuh...
echo Password keluar resmi: 1234567890
echo.

set "BROWSER_FLAGS=--kiosk %EXAM_URL% --edge-kiosk-type=fullscreen --no-first-run --disable-pinch --disable-features=TouchpadOverscrollHistoryNavigation,TranslateUI --overscroll-history-navigation=0"

:: Jalankan Microsoft Edge dalam Mode Kiosk
where msedge >nul 2>&1
if %errorlevel% equ 0 (
    start "" /wait msedge.exe %BROWSER_FLAGS%
    goto :RESTORE
)

:: Jalankan Google Chrome dalam Mode Kiosk
where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start "" /wait chrome.exe %BROWSER_FLAGS%
    goto :RESTORE
)

:: Fallback path
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" /wait "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" %BROWSER_FLAGS%
    goto :RESTORE
)

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" /wait "C:\Program Files\Google\Chrome\Application\chrome.exe" %BROWSER_FLAGS%
    goto :RESTORE
)

start "" "%EXAM_URL%"

:RESTORE
echo.
echo ========================================================
echo   UJIAN SELESAI - MEMULIHKAN SISTEM LAPTOP
echo ========================================================
echo Mengaktifkan kembali gestur usap 3 jari & 4 jari di Windows...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v ThreeFingerSwipesEnabled /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v FourFingerSwipesEnabled /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v EnableEdgy /t REG_DWORD /d 1 /f >nul 2>&1
echo [SELESAI] Gestur touchpad laptop telah normal kembali 100%%.
timeout /t 3 >nul
exit
