@echo off
title Restore Touchpad Gestures
color 0B
echo ========================================================
echo   PEMULIHAN GESTUR TOUCHPAD LAPTOP WINDOWS
echo ========================================================
echo.
echo Mengaktifkan kembali gestur usap 3 jari & 4 jari di Windows...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v ThreeFingerSwipesEnabled /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v FourFingerSwipesEnabled /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" /v EnableEdgy /t REG_DWORD /d 1 /f >nul 2>&1
echo.
echo [SUKSES] Gestur 3 jari (Task View) dan 4 jari (Ganti Desktop) telah normal kembali!
echo.
pause
