@echo off
REM ChoreCore Installation Script for Windows

echo.
echo ================================================
echo    ChoreCore Installation Script (Windows)
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detected
node -v
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm detected
npm -v
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!
echo.

REM Check for .env file
if not exist .env (
    echo [WARNING] No .env file found
    echo [INFO] Creating .env template...
    echo.
    
    (
        echo # ChoreCore Environment Variables
        echo # Replace these with your actual Supabase credentials
        echo.
        echo VITE_SUPABASE_URL=https://your-project.supabase.co
        echo VITE_SUPABASE_ANON_KEY=your-anon-public-key
        echo VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
        echo.
        echo # Get these from: https://supabase.com/dashboard/project/_/settings/api
    ) > .env
    
    echo [OK] Created .env template
    echo.
    echo [IMPORTANT] Edit .env and add your Supabase credentials!
    echo             Get them from: https://supabase.com/dashboard
    echo.
)

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Supabase CLI not found
    echo [INFO] Install it with: npm install -g supabase
    echo         (Required for deploying the backend server^)
    echo.
) else (
    echo [OK] Supabase CLI detected
    echo.
)

echo ================================================
echo    Installation Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Edit .env with your Supabase credentials
echo   2. Run database setup (see DATABASE_SETUP.md^)
echo   3. Deploy Supabase Edge Function (see DOWNLOAD_AND_DEPLOY.md^)
echo   4. Run 'npm run dev' to start the development server
echo.
echo Documentation:
echo   - START_HERE_NOW.md - Quick start guide
echo   - DATABASE_SETUP.md - Database setup instructions
echo   - DOWNLOAD_AND_DEPLOY.md - Deployment guide
echo.
echo Ready to start ChoreCore!
echo.
pause
