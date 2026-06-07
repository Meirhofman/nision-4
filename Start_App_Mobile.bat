@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo.
echo ═══════════════════════════════════════════════════════════════
echo   LAZOZ - הרצה למובייל
echo ═══════════════════════════════════════════════════════════════
echo.
echo אחרי שהשרת עולה, חפש בשורה "Network:" את הכתובת
echo לדוגמה: http://192.168.1.XX:5173/landing
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

if not exist "node_modules\.bin\vite.cmd" call npm install
call npm run dev

pause
endlocal
