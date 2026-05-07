@echo off
REM ScienceKit.in Complete Deployment Script
REM Run this script step-by-step for full deployment

echo ============================================
echo    SCIENCEKIT.IN COMPLETE DEPLOYMENT
echo ============================================
echo.

:menu
echo.
echo SELECT AN OPTION:
echo.
echo [1] Complete Deployment (Start to Finish)
echo [2] Step 1: GitHub Setup Only
echo [3] Step 2: Environment Variables Setup
echo [4] Step 3: Vercel Deployment
echo [5] Step 4: Database Setup (MongoDB)
echo [6] Step 5: Payment Gateway (Razorpay)
echo [7] Step 6: Cloudinary Setup
echo [8] Step 7: Final Testing
echo [9] Exit
echo.
set /p choice="Enter choice (1-9): "

if "%choice%"=="1" goto complete
if "%choice%"=="2" goto step1
if "%choice%"=="3" goto step2
if "%choice%"=="4" goto step3
if "%choice%"=="5" goto step4
if "%choice%"=="6" goto step5
if "%choice%"=="7" goto step6
if "%choice%"=="8" goto step7
if "%choice%"=="9" goto exit
goto invalid

:complete
echo.
echo ===== COMPLETE DEPLOYMENT =====
echo This will guide you through all steps.
pause
call :step1
call :step2
call :step3
call :step4
call :step5
call :step6
call :step7
goto success

:step1
echo.
echo ===== STEP 1: GITHUB SETUP =====
echo.
echo 1.1 Initializing Git...
git init
if %errorlevel% neq 0 (
    echo ERROR: Git not installed. Install from https://git-scm.com
    pause
    exit /b 1
)

echo.
echo 1.2 Adding files...
git add .

echo.
echo 1.3 Committing...
git commit -m "Initial commit - ScienceKit.in e-commerce"

echo.
echo 1.4 Creating GitHub repository...
echo.
echo INSTRUCTIONS:
echo 1. Open https://github.com in browser
echo 2. Click "+" -> "New repository"
echo 3. Name: sciencekit
echo 4. Description: ScienceKit.in - E-commerce for science kits
echo 5. Click "Create repository"
echo.
echo After creating, copy the repository URL.
echo.
set /p github_url="Paste your GitHub repository URL (e.g., https://github.com/username/sciencekit.git): "

echo.
echo 1.5 Connecting to GitHub...
git remote add origin %github_url%
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub. Check your URL and credentials.
    pause
    exit /b 1
)

echo.
echo ✓ GitHub setup complete!
echo Repository: %github_url%
pause
goto :eof

:step2
echo.
echo ===== STEP 2: ENVIRONMENT VARIABLES =====
echo.
echo 2.1 Creating .env.local file...
if exist .env.local (
    echo .env.local already exists. Backing up...
    copy .env.local .env.local.backup
)

echo.
echo Creating new .env.local with template...
(
echo # ========== DATABASE ==========
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sciencekit
echo.
echo # ========== SECURITY ==========
echo # Generate these with: openssl rand -base64 32
echo JWT_SECRET=your_64_character_jwt_secret_here
echo JWT_REFRESH_SECRET=your_64_character_refresh_secret_here
echo NEXTAUTH_SECRET=your_nextauth_secret_here
echo.
echo # ========== URLs ==========
echo NEXTAUTH_URL=http://localhost:3000
echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
echo.
echo # ========== PAYMENT (Test Mode) ==========
echo RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
echo RAZORPAY_KEY_SECRET=xxxxxxxxxx
echo.
echo # ========== CLOUDINARY ==========
echo CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
echo.
echo # ========== EMAIL ==========
echo EMAIL_SERVER=resend://re_xxxxxxxxxxxxxxxxx
) > .env.local

echo.
echo 2.2 Generating secure secrets...
echo Generating JWT secrets (copy these):
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('base64'))" 2>nul
if %errorlevel% neq 0 (
    echo Installing crypto module...
    npm install crypto
    node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('base64'))"
)

echo.
echo ✓ Environment variables template created!
echo Edit .env.local with your actual values.
echo.
pause
goto :eof

:step3
echo.
echo ===== STEP 3: VERCEL DEPLOYMENT =====
echo.
echo 3.1 Installing Vercel CLI...
npm install -g vercel

echo.
echo 3.2 Logging into Vercel...
echo A browser will open for login...
vercel login

echo.
echo 3.3 Deploying to Vercel...
vercel

echo.
echo 3.4 Deploying to production...
vercel --prod

echo.
echo ✓ Vercel deployment initiated!
echo Your site will be at: https://sciencekit.vercel.app
echo.
echo IMPORTANT: After deployment, go to Vercel Dashboard -> Project Settings
echo -> Environment Variables and add all variables from .env.local
echo.
pause
goto :eof

:step4
echo.
echo ===== STEP 4: DATABASE SETUP (MongoDB Atlas) =====
echo.
echo INSTRUCTIONS:
echo.
echo 1. Go to https://mongodb.com/cloud/atlas
echo 2. Sign up or log in
echo 3. Click "Create" -> "Create a Cluster"
echo 4. Choose FREE tier (M0)
echo 5. Select region: Mumbai or Singapore
echo 6. Click "Create Cluster" (takes 1-3 minutes)
echo.
echo 7. Create Database User:
echo    - Go to "Database Access" -> "Add New Database User"
echo    - Username: sciencekit_user
echo    - Password: Generate strong password
echo    - Privileges: Read and write to any database
echo.
echo 8. Whitelist IP:
echo    - Go to "Network Access" -> "Add IP Address"
echo    - Click "Allow Access from Anywhere" (0.0.0.0/0)
echo.
echo 9. Get Connection String:
echo    - Go to "Database" -> Click "Connect"
echo    - Choose "Connect your application"
echo    - Copy connection string
echo.
set /p mongodb_uri="Paste your MongoDB connection string: "

echo.
echo Updating .env.local with MongoDB URI...
powershell -Command "(Get-Content .env.local) -replace 'MONGODB_URI=.*', 'MONGODB_URI=%mongodb_uri%' | Set-Content .env.local"

echo.
echo ✓ MongoDB setup instructions provided!
echo Update Vercel environment variables with this MongoDB URI.
pause
goto :eof

:step5
echo.
echo ===== STEP 5: PAYMENT GATEWAY (Razorpay) =====
echo.
echo INSTRUCTIONS:
echo.
echo 1. Go to https://dashboard.razorpay.com/signup
echo 2. Complete registration and verification
echo 3. Go to Settings -> API Keys
echo 4. Click "Generate Key" -> Select "Test Mode"
echo 5. Copy Key ID and Key Secret
echo.
set /p razorpay_key="Enter Razorpay Key ID (rzp_test_xxxx): "
set /p razorpay_secret="Enter Razorpay Key Secret: "

echo.
echo Updating .env.local with Razorpay keys...
powershell -Command "
\$content = Get-Content .env.local;
\$content = \$content -replace 'RAZORPAY_KEY_ID=.*', 'RAZORPAY_KEY_ID=%razorpay_key%';
\$content = \$content -replace 'RAZORPAY_KEY_SECRET=.*', 'RAZORPAY_KEY_SECRET=%razorpay_secret%';
Set-Content .env.local \$content
"

echo.
echo ✓ Razorpay setup complete!
echo Update Vercel environment variables with these keys.
pause
goto :eof

:step6
echo.
echo ===== STEP 6: CLOUDINARY SETUP =====
echo.
echo INSTRUCTIONS:
echo.
echo 1. Go to https://cloudinary.com/users/register/free
echo 2. Complete registration
echo 3. Go to Dashboard -> Account Details
echo 4. Copy:
echo    - Cloud Name
echo    - API Key
echo    - API Secret
echo.
set /p cloud_name="Enter Cloudinary Cloud Name: "
set /p api_key="Enter Cloudinary API Key: "
set /p api_secret="Enter Cloudinary API Secret: "

set cloudinary_url=cloudinary://%api_key%:%api_secret%@%cloud_name%

echo.
echo Updating .env.local with Cloudinary URL...
powershell -Command "(Get-Content .env.local) -replace 'CLOUDINARY_URL=.*', 'CLOUDINARY_URL=%cloudinary_url%' | Set-Content .env.local"

echo.
echo ✓ Cloudinary setup complete!
echo Update Vercel environment variables with Cloudinary URL.
pause
goto :eof

:step7
echo.
echo ===== STEP 7: FINAL TESTING =====
echo.
echo 7.1 Testing build locally...
npm run build

if %errorlevel% neq 0 (
    echo ERROR: Build failed! Fix errors before deployment.
    pause
    exit /b 1
)

echo.
echo 7.2 Starting local server for testing...
echo Press Ctrl+C to stop after testing
echo.
echo Open browser to: http://localhost:3000
echo.
echo Test these features:
echo 1. Homepage loads
echo 2. User registration
echo 3. Product browsing
echo 4. Add to cart
echo 5. Checkout (test mode)
echo.
npm run dev

echo.
echo ✓ Testing complete!
echo Your website is ready for production.
pause
goto :eof

:success
echo.
echo ============================================
echo    DEPLOYMENT COMPLETE! 🎉
echo ============================================
echo.
echo Your ScienceKit.in website is now live at:
echo https://sciencekit.vercel.app
echo.
echo NEXT STEPS:
echo 1. Share your website with customers
echo 2. Test all features thoroughly
echo 3. Set up custom domain (optional)
echo 4. Monitor analytics in Vercel dashboard
echo.
echo For updates:
echo git add . && git commit -m "Update" && git push
echo.
pause
goto exit

:invalid
echo Invalid choice. Please try again.
pause
goto menu

:exit
echo.
echo Deployment script completed.
echo Check FULL_DEPLOYMENT_GUIDE.md for detailed instructions.
pause