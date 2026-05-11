@echo off
echo ===============================================
echo   BRANDINGO APP - Setup ^& Launch Script
echo ===============================================
echo.
echo [1/2] Installing dependencies...
npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)
echo.
echo [2/2] Starting development server...
echo.
echo  Open your browser to: http://localhost:5173
echo  Admin panel:          http://localhost:5173/admin
echo.
npm run dev
pause
