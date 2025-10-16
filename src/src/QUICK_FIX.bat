@echo off
REM ChoreCore - Quick Build Fix Script (Windows)
REM Run this if your build is failing

echo.
echo 🔧 ChoreCore Build Fix Script
echo ==============================
echo.

REM Step 1: Clean everything
echo 📦 Step 1: Cleaning old builds...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
if exist package-lock.json del package-lock.json
echo ✅ Cleaned!
echo.

REM Step 2: Reinstall dependencies
echo 📥 Step 2: Installing fresh dependencies...
call npm install
echo ✅ Dependencies installed!
echo.

REM Step 3: Try building
echo 🔨 Step 3: Building project...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ ✅ ✅ BUILD SUCCESSFUL! ✅ ✅ ✅
    echo.
    echo Next steps:
    echo   1. Test dev server: npm run dev
    echo   2. Test preview: npm run preview
    echo   3. Build desktop app: pake http://localhost:4173 --config pakeplus.json
    echo.
) else (
    echo.
    echo ❌ Build failed. Try these:
    echo   1. Check Node version: node --version (need 18+)
    echo   2. Check error message above
    echo   3. Read /FIX_BUILD.md for detailed solutions
    echo.
)

pause
