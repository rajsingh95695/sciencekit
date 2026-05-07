# ScienceKit.in Quick Deployment Guide

## 🚀 Fastest Way to Deploy (Vercel - 10 Minutes)

### Step 1: Test Build Locally
```cmd
cd "c:\Users\rajsi\OneDrive\Desktop\my web"
npm run build
```
If build succeeds, continue. If fails, fix errors first.

### Step 2: Push to GitHub
```cmd
git init
git add .
git commit -m "Deploy to Vercel"
git branch -M main

# Create repo at https://github.com/new (name: sciencekit)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/sciencekit.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign up with GitHub
3. Click "Import" on your sciencekit repository
4. Click "Deploy" (no configuration needed)

### Step 4: Add Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate_with_openssl_rand_base64_32
JWT_REFRESH_SECRET=another_secret
NEXTAUTH_SECRET=nextauth_secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### Step 5: Redeploy
After adding variables, go to Deployments → "Redeploy"

## 📊 Platform Comparison Summary

### Vercel (Best Choice) ✅
- **Time:** 10 minutes
- **Cost:** Free (100GB bandwidth)
- **Pros:** Native Next.js support, fastest deployment
- **URL:** `https://sciencekit.vercel.app`

### Netlify (Good Alternative) ✅
- **Time:** 15 minutes
- **Cost:** Free (100GB bandwidth)
- **Pros:** Easy setup, good free tier
- **URL:** `https://sciencekit.netlify.app`

### Manual/Docker (For Control) ⚠️
- **Time:** 30+ minutes
- **Cost:** VPS required ($5-10/month)
- **Pros:** Full control, custom setup

## 🔧 Environment Variables Checklist

Create `.env.local` with these **REQUIRED** variables:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sciencekit

# Security (generate with: openssl rand -base64 32)
JWT_SECRET=your_64_char_secret
JWT_REFRESH_SECRET=another_64_char_secret
NEXTAUTH_SECRET=nextauth_secret

# URLs
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Payment (optional for testing)
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx

# Cloudinary (optional)
CLOUDINARY_URL=cloudinary://key:secret@cloudname
```

## 🎯 One-Click Deployment Options

### Option A: Vercel Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/sciencekit)

### Option B: Netlify Deploy Button
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/sciencekit)

## 📱 Mobile-Friendly Deployment

### Using GitHub Mobile:
1. Install GitHub app
2. Push code from phone
3. Vercel/Netlify auto-deploys

### Using Termux (Android):
```bash
pkg install nodejs git
git clone https://github.com/YOUR_USERNAME/sciencekit
cd sciencekit
npm install
npm run build
# Deploy using Vercel CLI
npm install -g vercel
vercel --prod
```

## 🚨 Common Issues & Fixes

### 1. Build Fails
```cmd
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### 2. MongoDB Connection Error
- Whitelist IP `0.0.0.0/0` in MongoDB Atlas
- Check connection string format
- Test with MongoDB Compass

### 3. Payment Gateway Not Working
- Use sandbox/test keys first
- Configure webhook URLs
- Check Razorpay dashboard for logs

### 4. Images Not Loading
- Verify Cloudinary credentials
- Check `next.config.ts` remote patterns
- Test with local images first

## 📈 Post-Deployment Checklist

- [ ] Homepage loads without errors
- [ ] API routes work (`/api/health`)
- [ ] User registration/login works
- [ ] Product pages display correctly
- [ ] Cart functionality works
- [ ] Payment test (sandbox mode)
- [ ] Admin dashboard accessible
- [ ] Mobile responsive
- [ ] SSL certificate active (🔒 in browser)

## 🆘 Quick Support

### Vercel Support:
- Docs: [Next.js on Vercel](https://nextjs.org/docs/deployment)
- Status: [vercel-status.com](https://www.vercel-status.com)

### Netlify Support:
- Docs: [Netlify Next.js](https://docs.netlify.com/frameworks/next-js/)
- Community: [Netlify Community](https://community.netlify.com)

### Database Help:
- MongoDB Atlas: [atlas.mongodb.com](https://atlas.mongodb.com)
- Free Cluster: 512MB storage

## 🎉 Success Message

Once deployed, your e-commerce store will be live at:
**`https://sciencekit.vercel.app`**

Share with customers:
- WhatsApp: `https://wa.me/?text=Check%20out%20ScienceKit%20${URL}`
- Email: "Our store is now live at ${URL}"

## 🔄 Update Instructions

To update your deployed site:
```cmd
# Make changes locally
git add .
git commit -m "Update products"
git push origin main
# Vercel/Netlify auto-deploys
```

## 📞 Need Help?

1. Check deployment logs in Vercel/Netlify dashboard
2. Review error messages in browser console
3. Test API endpoints with Postman/curl
4. Check MongoDB Atlas connection

---

**Deployment Time:** 10-15 minutes  
**Cost:** $0 (free tier)  
**Live URL:** Ready in minutes  

**Start now:** Double-click `deploy.bat` or follow Step-by-Step guide above!