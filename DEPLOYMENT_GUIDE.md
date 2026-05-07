# ScienceKit.in Deployment Guide

## Project Overview
ScienceKit.in is a production-ready Next.js 16 e-commerce platform with:
- Next.js App Router + TypeScript + Tailwind CSS
- MongoDB Atlas database
- JWT authentication with refresh tokens
- Razorpay/Cashfree payment integration
- Cloudinary media management
- Admin dashboard with bulk operations

## Deployment Requirements

### 1. Environment Variables
Create `.env.local` with these required variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sciencekit

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your-64-character-secret
JWT_REFRESH_SECRET=your-64-character-refresh-secret

# Payment Gateways
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx
CASHFREE_APP_ID=your-app-id
CASHFREE_SECRET_KEY=your-secret-key

# Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email (Resend or SMTP)
EMAIL_SERVER=resend://re_xxxxxxxxxxxxxxxxx
# OR for SMTP: smtp://user:pass@smtp.gmail.com:587

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Application URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Database Setup
1. Create MongoDB Atlas cluster at https://mongodb.com
2. Whitelist IP `0.0.0.0/0` (or your server IP)
3. Create database user with read/write permissions
4. Get connection string and update `MONGODB_URI`

### 3. Payment Gateway Setup
- **Razorpay**: Create account at https://razorpay.com, get API keys
- **Cashfree**: Create account at https://cashfree.com, get App ID and Secret Key

### 4. Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Get API key, API secret, and cloud name
3. Format: `cloudinary://api_key:api_secret@cloud_name`

## Deployment Platforms

### Option 1: Vercel (Recommended)
**Steps:**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com
3. Import your repository
4. Configure environment variables in Project Settings → Environment Variables
5. Set Build Command: `npm run build`
6. Set Output Directory: `.next`
7. Deploy

**Vercel-Specific Settings:**
```env
# In Vercel Environment Variables
NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

### Option 2: AWS (EC2/Amplify)
**AWS Amplify:**
1. Connect repository to AWS Amplify
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables in Amplify Console

**EC2 Manual Deployment:**
```bash
# SSH to EC2 instance
sudo apt update
sudo apt install nodejs npm nginx

# Clone repository
git clone https://github.com/your-repo/sciencekit.git
cd sciencekit

# Install dependencies
npm install

# Build application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start npm --name "sciencekit" -- start

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/sciencekit
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Railway
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

### Option 4: Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t sciencekit .
docker run -p 3000:3000 --env-file .env.local sciencekit
```

## Pre-Deployment Checklist

### ✅ Build Test
```bash
npm run build
```
Ensure build completes without errors.

### ✅ Environment Validation
```bash
# Check environment variables
node -e "console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Missing')"
```

### ✅ Database Connection Test
```bash
# Test MongoDB connection
npm run seed:admin
```

### ✅ Security Checks
1. Remove any hardcoded secrets from code
2. Ensure `.env.local` is in `.gitignore`
3. Verify CORS settings in `next.config.ts`

## Post-Deployment Steps

### 1. Create Admin User
```bash
# Run seed script (if available)
npm run seed:admin

# Or manually register first user and update role to admin in MongoDB
```

### 2. SSL/HTTPS Setup
- **Vercel/AWS Amplify**: Automatic SSL
- **Manual**: Use Let's Encrypt with Certbot
  ```bash
  sudo certbot --nginx -d your-domain.com
  ```

### 3. Monitoring & Logging
- **Vercel**: Built-in analytics
- **AWS**: CloudWatch logs
- **Custom**: Add Sentry/LogRocket

### 4. Backup Strategy
1. MongoDB Atlas automated backups
2. Regular database exports
3. Code backups to GitHub

## Troubleshooting

### Common Issues:

1. **Build Fails on Vercel**
   - Check Node.js version (requires 18+)
   - Verify all environment variables are set
   - Check build memory limits

2. **Database Connection Errors**
   - Verify MongoDB URI format
   - Check IP whitelisting in Atlas
   - Test connection with MongoDB Compass

3. **Payment Gateway Issues**
   - Verify API keys are correct
   - Check webhook URLs are configured
   - Test in sandbox mode first

4. **Image Upload Fails**
   - Verify Cloudinary credentials
   - Check file size limits
   - Test with small image first

### Debug Commands:
```bash
# Check application logs
pm2 logs sciencekit

# Check database connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(console.error)"

# Test API endpoints
curl https://your-domain.com/api/health
```

## Performance Optimization

### 1. CDN for Static Assets
- Configure Cloudinary CDN
- Use Vercel's edge network

### 2. Database Indexing
```javascript
// Ensure indexes are created
await Product.createIndexes();
await Order.createIndexes();
```

### 3. Caching Strategy
- Implement Redis for session caching
- Use Next.js ISR for product pages

## Maintenance

### Regular Tasks:
1. Update dependencies: `npm update`
2. Monitor error logs
3. Backup database weekly
4. Review security patches

### Scaling:
- **Vertical**: Upgrade server resources
- **Horizontal**: Add more instances behind load balancer
- **Database**: MongoDB Atlas auto-scaling

## Support
- Check logs in deployment platform
- Review Next.js documentation
- MongoDB Atlas monitoring dashboard
- Payment gateway webhook logs

---

**Deployment Status Dashboard:**
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Build successful
- [ ] SSL certificate installed
- [ ] Admin user created
- [ ] Payment gateway tested
- [ ] Monitoring configured
- [ ] Backup strategy implemented

**Ready for Production!**