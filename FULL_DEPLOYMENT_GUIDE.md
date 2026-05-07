# ScienceKit.in Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: GitHub Setup](#step-1-github-setup)
3. [Step 2: Environment Variables](#step-2-environment-variables)
4. [Step 3: Vercel Deployment](#step-3-vercel-deployment)
5. [Step 4: Database Setup](#step-4-database-setup)
6. [Step 5: Payment Gateway Setup](#step-5-payment-gateway-setup)
7. [Step 6: Final Testing](#step-6-final-testing)
8. [Troubleshooting](#troubleshooting)

## 🎯 Prerequisites

### What You Need:
1. **GitHub Account** - [Sign up here](https://github.com/signup)
2. **Vercel Account** - [Sign up here](https://vercel.com/signup)
3. **MongoDB Atlas Account** - [Sign up here](https://mongodb.com/cloud/atlas/register)
4. **Razorpay Account** (for payments) - [Sign up here](https://razorpay.com/signup)
5. **Cloudinary Account** (for images) - [Sign up here](https://cloudinary.com/users/register/free)

---

## 🚀 Step 1: GitHub Setup

### 1.1 Initialize Git in Your Project
Open Command Prompt in your project folder and run:

```cmd
cd "c:\Users\rajsi\OneDrive\Desktop\my web"
git init
git add .
git commit -m "Initial commit - ScienceKit.in e-commerce"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Fill details:
   - **Repository name**: `sciencekit`
   - **Description**: `ScienceKit.in - E-commerce for science kits`
   - **Public** (or Private if you prefer)
   - **Do NOT** initialize with README
4. Click "Create repository"

### 1.3 Connect and Push to GitHub
Copy the commands from GitHub and run:

```cmd
git remote add origin https://github.com/YOUR_USERNAME/sciencekit.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

---

## 🔧 Step 2: Environment Variables

### 2.1 Create `.env.local` File
Create a file named `.env.local` in your project root with:

```env
# ========== DATABASE ==========
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sciencekit

# ========== SECURITY ==========
# Generate these with: openssl rand -base64 32
JWT_SECRET=your_64_character_jwt_secret_here
JWT_REFRESH_SECRET=your_64_character_refresh_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here

# ========== URLs ==========
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ========== PAYMENT (Test Mode) ==========
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx

# ========== CLOUDINARY ==========
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# ========== EMAIL ==========
EMAIL_SERVER=resend://re_xxxxxxxxxxxxxxxxx
# OR use SMTP: smtp://user:pass@smtp.gmail.com:587

# ========== OPTIONAL ==========
# GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# CASHFREE_APP_ID=your-cashfree-app-id
# CASHFREE_SECRET_KEY=your-cashfree-secret-key
```

### 2.2 Generate Secure Secrets
Open Command Prompt and run:

```cmd
# Generate JWT secrets
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('NEXTAUTH_SECRET:', require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and replace in `.env.local`

---

## 🌐 Step 3: Vercel Deployment

### 3.1 Deploy via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub
3. Click "Import" → Select your `sciencekit` repository
4. Configure project:
   - **Project Name**: `sciencekit` (auto-detected)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. Click "Deploy"

### 3.2 Add Environment Variables in Vercel
After deployment, go to:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add ALL variables from your `.env.local` but update URLs:
   ```
   NEXTAUTH_URL=https://sciencekit.vercel.app
   NEXT_PUBLIC_BASE_URL=https://sciencekit.vercel.app
   ```
3. Click "Save"

### 3.3 Redeploy
Go to Deployments → Latest Deployment → "Redeploy"

---

## 🗄️ Step 4: Database Setup (MongoDB Atlas)

### 4.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Click "Create" → "Create a Cluster"
3. Choose **FREE** tier (M0)
4. Select region closest to India (e.g., Mumbai)
5. Click "Create Cluster" (takes 1-3 minutes)

### 4.2 Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Set:
   - **Authentication Method**: Password
   - **Username**: `sciencekit_user`
   - **Password**: Generate strong password
   - **Database User Privileges**: Read and write to any database
3. Click "Add User"

### 4.3 Whitelist IP Address
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 4.4 Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://sciencekit_user:<password>@cluster0.xxxxx.mongodb.net/sciencekit
   ```
4. Replace `<password>` with your actual password
5. Update `MONGODB_URI` in Vercel environment variables

---

## 💳 Step 5: Payment Gateway Setup (Razorpay)

### 5.1 Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Complete registration
3. Verify email and phone

### 5.2 Get API Keys
1. Go to Settings → API Keys
2. Click "Generate Key"
3. Select "Test Mode"
4. Copy:
   - **Key ID**: `rzp_test_xxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxx`
5. Add these to Vercel environment variables

### 5.3 Configure Webhooks (Optional but Recommended)
1. Go to Settings → Webhooks
2. Add Webhook:
   - **URL**: `https://sciencekit.vercel.app/api/payments/webhook`
   - **Events**: Select all payment events
3. Save

---

## ☁️ Step 6: Cloudinary Setup

### 6.1 Create Cloudinary Account
1. Go to [Cloudinary Signup](https://cloudinary.com/users/register/free)
2. Complete registration

### 6.2 Get API Credentials
1. Go to Dashboard
2. Copy from "Account Details":
   - **Cloud Name**: `xxxxxx`
   - **API Key**: `xxxxxxxxxx`
   - **API Secret**: `xxxxxxxxxx`
3. Format as URL:
   ```
   cloudinary://api_key:api_secret@cloud_name
   ```
4. Add to Vercel environment variables as `CLOUDINARY_URL`

---

## 🧪 Step 7: Final Testing

### 7.1 Test Your Live Website
Open: `https://sciencekit.vercel.app`

### 7.2 Test Key Features:
1. **Homepage**: Should load without errors
2. **Registration**: Create test account
3. **Products**: Browse products
4. **Cart**: Add items to cart
5. **Checkout**: Test with Razorpay sandbox
6. **Admin**: Login as admin (if seeded)

### 7.3 Create Admin User
Run seed script or manually:

```bash
# If you have seed script
npm run seed:admin

# Or create admin manually through registration
# Then update user role to "admin" in MongoDB
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions:

#### 1. Build Fails on Vercel
```bash
# Check build logs in Vercel
# Common fixes:
# - Ensure all environment variables are set
# - Check TypeScript errors locally first
npm run build
```

#### 2. MongoDB Connection Error
- Verify connection string format
- Check IP whitelist includes 0.0.0.0/0
- Test connection with MongoDB Compass

#### 3. Payment Not Working
- Use Razorpay test keys
- Check webhook URLs
- Test with test card: `4111 1111 1111 1111`

#### 4. Images Not Uploading
- Verify Cloudinary credentials
- Check file size limits (<10MB)
- Test with small image first

#### 5. Authentication Issues
- Check JWT secrets are set
- Verify NEXTAUTH_URL matches deployment URL
- Clear browser cookies and retry

---

## 📞 Support Resources

### Documentation:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Razorpay API Docs](https://razorpay.com/docs)

### Community:
- [Vercel Community](https://vercel.com/community)
- [Next.js Discord](https://nextjs.org/discord)
- [GitHub Issues](https://github.com/vercel/next.js/issues)

---

## 🎉 Success Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel deployment successful
- [ ] MongoDB Atlas cluster running
- [ ] Environment variables configured
- [ ] Razorpay test keys added
- [ ] Cloudinary configured
- [ ] Website loads without errors
- [ ] User registration works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Payment test successful

---

## 🔄 Update Process

To update your live website:

```bash
# 1. Make changes locally
git add .
git commit -m "Update products"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys
# Check Vercel dashboard for status
```

---

## 📱 Mobile Deployment

### Using GitHub Mobile App:
1. Install GitHub app
2. Push code from phone
3. Vercel auto-deploys

### Using Termux (Android):
```bash
pkg install nodejs git
git clone https://github.com/YOUR_USERNAME/sciencekit
cd sciencekit
npm install
# Make changes and push
```

---

## 💰 Cost Summary

| Service | Free Tier | Paid Tier (When Needed) |
|---------|-----------|-------------------------|
| **Vercel** | 100GB bandwidth | $20/month (Pro) |
| **MongoDB Atlas** | 512MB storage | $9/month (M10) |
| **Razorpay** | 2% transaction fee | Volume discounts |
| **Cloudinary** | 25GB bandwidth | Pay-as-you-go |

**Total Monthly Cost (Starting): $0**

---

## 🚨 Emergency Contacts

### If Website Goes Down:
1. Check Vercel Status: [vercel-status.com](https://www.vercel-status.com)
2. Check MongoDB Status: [status.mongodb.com](https://status.mongodb.com)
3. Check Razorpay Status: [status.razorpay.com](https://status.razorpay.com)

### Quick Recovery:
```bash
# Redeploy from Vercel dashboard
# OR
vercel --prod
```

---

## ✅ Final Step: Share Your Website

Your website is now live at:
**`https://sciencekit.vercel.app`**

Share with:
- WhatsApp: `https://wa.me/?text=Check%20out%20ScienceKit%20${URL}`
- Email: "Our store is now live at ${URL}"
- Social Media: Share the link

---

## 📋 Need More Help?

Contact for assistance:
1. **Vercel Support**: support@vercel.com
2. **MongoDB Support**: cloud.support@mongodb.com
3. **Razorpay Support**: help@razorpay.com

**Congratulations! Your ScienceKit.in e-commerce website is now live and ready for business!** 🎉