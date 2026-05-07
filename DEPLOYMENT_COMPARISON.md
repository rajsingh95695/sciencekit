# ScienceKit.in Deployment Platform Comparison

## Platform Recommendation: VERCEL (Best Choice)

**Verdict:** For your Next.js e-commerce website, **Vercel is the best choice**, followed by Netlify. AWS/Railway are good alternatives for more control.

### Quick Comparison Table

| Platform | Next.js Support | API Routes | Server Functions | Free Tier | Ease of Use | Best For |
|----------|----------------|------------|------------------|-----------|-------------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ (Native) | ✅ Full | ✅ Edge Functions | 100GB bandwidth | ⭐⭐⭐⭐⭐ | Next.js projects |
| **Netlify** | ⭐⭐⭐⭐ (Good) | ✅ Full | ✅ Serverless | 100GB bandwidth | ⭐⭐⭐⭐ | Static + API sites |
| **AWS Amplify** | ⭐⭐⭐ (Good) | ✅ Full | ✅ Lambda | 1GB storage | ⭐⭐⭐ | AWS ecosystem |
| **Railway** | ⭐⭐⭐⭐ (Very Good) | ✅ Full | ✅ Any backend | $5 credit | ⭐⭐⭐⭐ | Full-stack apps |
| **Render** | ⭐⭐⭐ (Good) | ✅ Full | ✅ Web Services | 750 hours | ⭐⭐⭐ | Simple deployments |

## Detailed Platform Analysis

### 1. VERCEL (Recommended)
**Pros:**
- Built by Next.js creators - perfect compatibility
- Zero-config deployment for Next.js
- Automatic preview deployments for PRs
- Edge Functions for global performance
- Built-in analytics and monitoring
- Free custom domain with SSL
- Automatic CI/CD from GitHub

**Cons:**
- Serverless functions have cold starts
- Limited build minutes on free tier (100 hours/month)
- Database needs external service (MongoDB Atlas)

**Pricing:**
- **Free:** 100GB bandwidth, 100 hours build, unlimited sites
- **Pro:** $20/month - more build minutes, analytics
- **Enterprise:** Custom pricing

### 2. NETLIFY (Good Alternative)
**Pros:**
- Excellent free tier (100GB bandwidth)
- Easy environment variables setup
- Good Git integration
- Form handling built-in
- Split testing features

**Cons:**
- Next.js support good but not as optimized as Vercel
- Serverless functions limited to 125k invocations/month free
- Slightly slower builds for Next.js

**Pricing:**
- **Free:** 100GB bandwidth, 300 build minutes
- **Pro:** $19/month - more features
- **Enterprise:** Custom

### 3. AWS Amplify (For AWS Users)
**Pros:**
- Tight AWS integration (Cognito, S3, etc.)
- Good for scaling
- Pay-as-you-go pricing

**Cons:**
- Complex setup for beginners
- AWS billing can be confusing
- Slower initial deployment

### 4. Railway/Render (Simpler Alternatives)
**Pros:**
- Simple pricing
- Good for full-stack apps
- Database provisioning easy

**Cons:**
- Less Next.js-specific optimizations
- Smaller community

## Step-by-Step Deployment Guides

### OPTION 1: VERCEL Deployment (Recommended)

#### Step 1: Prepare Your Code
```bash
# Ensure your code is ready
cd "c:/Users/rajsi/OneDrive/Desktop/my web"

# Test build locally
npm run build

# If build fails, fix issues first
```

#### Step 2: Push to GitHub
```bash
# Initialize git if not already
git init
git add .
git commit -m "Ready for deployment"

# Create repository on GitHub.com
# Then push:
git remote add origin https://github.com/yourusername/sciencekit.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### Step 4: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sciencekit
JWT_SECRET=your-64-character-secret
JWT_REFRESH_SECRET=your-64-character-refresh-secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
EMAIL_SERVER=resend://re_xxxxxxxxxxxxxxxxx
```

#### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build
3. Get your live URL: `https://sciencekit.vercel.app`

#### Step 6: Custom Domain (Optional)
1. Go to Domains in Vercel
2. Add your domain (sciencekit.in)
3. Update DNS records as instructed
4. SSL automatically enabled

### OPTION 2: NETLIFY Deployment

#### Step 1: Prepare Netlify Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Push to GitHub (same as Vercel)

#### Step 3: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import from Git"
4. Select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 20

#### Step 4: Set Environment Variables
Netlify → Site Settings → Environment Variables
Add all variables from `.env.example`

#### Step 5: Deploy
1. Click "Deploy site"
2. Get URL: `https://your-site.netlify.app`

### OPTION 3: Manual Deployment Script

Create `deploy.sh` for manual deployment:
```bash
#!/bin/bash
# ScienceKit.in Deployment Script

echo "=== ScienceKit.in Deployment ==="

# 1. Build check
echo "1. Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed! Fix errors first."
    exit 1
fi

echo "Build successful!"

# 2. Environment check
echo "2. Checking environment variables..."
required_vars=("MONGODB_URI" "JWT_SECRET" "NEXTAUTH_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "ERROR: $var is not set"
        exit 1
    fi
done

# 3. Choose platform
echo "3. Select deployment platform:"
echo "   1) Vercel (Recommended)"
echo "   2) Netlify"
echo "   3) Manual (Docker)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Deploying to Vercel..."
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "Deploying to Netlify..."
        # Install Netlify CLI if not present
        if ! command -v netlify &> /dev/null; then
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    3)
        echo "Manual Docker deployment..."
        docker build -t sciencekit .
        docker run -d -p 3000:3000 --name sciencekit-app sciencekit
        echo "App running on http://localhost:3000"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo "=== Deployment Complete ==="
```

## Post-Deployment Checklist

### For All Platforms:
1. ✅ Test homepage loads
2. ✅ Test API routes (`/api/health` if exists)
3. ✅ Test authentication flow
4. ✅ Test payment integration (sandbox mode)
5. ✅ Test image uploads
6. ✅ Check console for errors
7. ✅ Verify environment variables
8. ✅ Set up monitoring (Vercel Analytics/Netlify Analytics)

### Database Setup:
```bash
# Run seed script after deployment
# For Vercel, use Vercel CLI:
vercel env pull .env.local
npm run seed:admin

# Or manually create admin user through UI
```

### Payment Gateway Webhooks:
**Razorpay Webhook URL:**
```
https://your-domain.com/api/payments/webhook
```

**Cashfree Webhook URL:**
```
https://your-domain.com/api/payments/cashfree-webhook
```

## Troubleshooting Common Issues

### 1. Build Fails on Vercel/Netlify
```bash
# Check build logs for:
# - Missing dependencies
# - TypeScript errors
# - Environment variables

# Fix: Test locally first
npm run build
```

### 2. API Routes Return 404
```bash
# Check:
# - Route handlers exist in app/api/
# - No CORS issues
# - Environment variables set
```

### 3. MongoDB Connection Fails
```bash
# Verify:
# 1. MongoDB Atlas IP whitelist includes 0.0.0.0/0
# 2. Connection string is correct
# 3. Database user has correct permissions
```

### 4. Images Not Loading
```bash
# Check:
# 1. Cloudinary credentials
# 2. next.config.ts remotePatterns
# 3. Image component usage
```

## Performance Optimization

### Vercel-Specific:
```javascript
// In next.config.ts
const nextConfig = {
  // Enable ISR for product pages
  experimental: {
    isrMemoryCacheSize: 50,
  },
};
```

### Netlify-Specific:
```toml
# In netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

## Cost Comparison (Monthly)

| Platform | Free Tier | Paid Tier (Basic) | Best For |
|----------|-----------|-------------------|----------|
| **Vercel** | 100GB bandwidth | $20 (Pro) | Next.js projects |
| **Netlify** | 100GB bandwidth | $19 (Pro) | Static + API sites |
| **AWS Amplify** | 1GB storage | ~$10-20 | AWS users |
| **Railway** | $5 credit | $20 (Starter) | Full-stack apps |
| **MongoDB Atlas** | 512MB storage | ~$9 (M0) | Database |

## Final Recommendation

**For ScienceKit.in: Choose VERCEL because:**

1. **Native Next.js Support**: Built by same team, zero configuration
2. **Better Developer Experience**: Faster builds, better error messages
3. **Free Tier Sufficient**: 100GB bandwidth enough for starting
4. **Easy Scaling**: Upgrade to Pro when traffic grows
5. **Indian Payment Support**: Vercel accepts Indian payment methods

**If you prefer Netlify:**
- Also excellent choice
- Slightly better free tier for bandwidth
- Good for learning

**Deployment Time Estimate:**
- Vercel: 10-15 minutes (first time)
- Netlify: 15-20 minutes (first time)
- Manual: 30-60 minutes

## Quick Start Command
```bash
# One-line Vercel deployment (if Vercel CLI installed)
cd "c:/Users/rajsi/OneDrive/Desktop/my web"
vercel --prod
```

Your website will be live at `https://sciencekit.vercel.app` within minutes!