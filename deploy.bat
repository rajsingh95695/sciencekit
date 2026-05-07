@echo off
REM ScienceKit.in Windows Deployment Script
REM Run this script to deploy your website

echo ========================================
echo    ScienceKit.in Deployment Assistant
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo 1. Checking Node.js version...
node -v

echo.
echo 2. Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo 3. Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Build failed! Fix errors before deployment.
    echo.
    echo Common issues:
    echo - Missing environment variables
    echo - TypeScript errors
    echo - Missing dependencies
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.

echo 4. Choose deployment platform:
echo.
echo   1) Vercel (Recommended for Next.js)
echo   2) Netlify (Good alternative)
echo   3) Manual/Docker
echo   4) Just test locally
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto docker
if "%choice%"=="4" goto local
goto invalid

:vercel
echo.
echo ===== VERCEL DEPLOYMENT =====
echo.
echo Step 1: Install Vercel CLI
call npm install -g vercel

echo.
echo Step 2: Login to Vercel (if first time)
echo If you haven't logged in before, browser will open
vercel login

echo.
echo Step 3: Deploy to production
vercel --prod

echo.
echo Deployment complete!
echo Your site will be live at: https://sciencekit.vercel.app
goto end

:netlify
echo.
echo ===== NETLIFY DEPLOYMENT =====
echo.
echo Step 1: Install Netlify CLI
call npm install -g netlify-cli

echo.
echo Step 2: Login to Netlify
netlify login

echo.
echo Step 3: Initialize Netlify (first time only)
netlify init

echo.
echo Step 4: Deploy to production
netlify deploy --prod

echo.
echo Deployment complete!
goto end

:docker
echo.
echo ===== DOCKER DEPLOYMENT =====
echo.
echo Step 1: Create Dockerfile (if not exists)
if not exist Dockerfile (
    echo Creating Dockerfile...
    echo FROM node:20-alpine > Dockerfile
    echo WORKDIR /app >> Dockerfile
    echo COPY package*.json ./ >> Dockerfile
    echo RUN npm ci --only=production >> Dockerfile
    echo COPY . . >> Dockerfile
    echo RUN npm run build >> Dockerfile
    echo EXPOSE 3000 >> Dockerfile
    echo CMD ["npm", "start"] >> Dockerfile
)

echo.
echo Step 2: Build Docker image
docker build -t sciencekit .

echo.
echo Step 3: Run container
docker run -d -p 3000:3000 --name sciencekit-app sciencekit

echo.
echo Application running at: http://localhost:3000
goto end

:local
echo.
echo ===== LOCAL TEST =====
echo.
echo Starting development server...
echo Press Ctrl+C to stop
echo.
echo Open browser to: http://localhost:3000
echo.
npm run dev
goto end

:invalid
echo Invalid choice. Please run script again.
pause
exit /b 1

:end
echo.
echo ========================================
echo    Deployment process completed!
echo ========================================
echo.
echo Next steps:
echo 1. Test your website
echo 2. Set up custom domain (if needed)
echo 3. Configure payment gateway webhooks
echo 4. Create admin user
echo.
pause