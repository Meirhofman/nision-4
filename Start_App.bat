@echo off
chcp 65001 >nul
setlocal
title LAZOZ - שרת פיתוח
color 0A

echo.
echo ═══════════════════════════════════════════════════════════════
echo   LAZOZ - הפעלת האפליקציה
echo ═══════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"
if not exist "package.json" (
    echo שגיאה: הרץ את הקובץ מתוך תיקיית הפרויקט:
    echo   -4--main (1)\-4--main\-4--main
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo שגיאה: npm לא מותקן. התקן Node.js מ-https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
    echo מתקין תלויות... (פעם ראשונה - עשוי לקחת דקה)
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo התקנה נכשלה.
        pause
        exit /b 1
    )
)

echo.
echo מפעיל שרת על http://localhost:5173
echo הדפדפן ייפתח אוטומטית כשהשרת מוכן.
echo.
echo קישורים שימושיים:
echo   דף הבית:     http://localhost:5173/landing
echo   התחברות:   http://localhost:5173/login
echo   טלפון+SMS:  http://localhost:5173/login  ^(טאב טלפון^)
echo.
echo לעצירה: Ctrl+C
echo ═══════════════════════════════════════════════════════════════
echo.

call npm run dev

echo.
echo השרת הופסק.
pause
endlocal
