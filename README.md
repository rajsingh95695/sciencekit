# ScienceKit.in

ScienceKit.in is a production-oriented single-vendor e-commerce platform for selling ready-made science, electronics, Arduino, ESP32, IoT, robotics, and academic project kits. It uses Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, MongoDB Atlas, JWT auth with refresh tokens, Cloudinary media, Razorpay/Cashfree payments, and Vercel deployment.

## Features

- JWT auth with secure HTTP-only cookies, refresh token rotation, forgot/reset password, and admin role controls
- Product, category, banner, coupon, blog, FAQ, review, wishlist, cart, order, and contact management
- Live search suggestions, filters, recently viewed, stock alerts, shipping estimator, bulk upload, Cloudinary signed uploads
- Checkout with tax/shipping estimation, Razorpay, Cashfree, and COD
- Invoice PDF generation, transactional emails, contact inbox + admin logs, rate limiting, CSRF protection, SEO pages, sitemap, and robots.txt

## Folder Structure

```text
app/
  (auth)/
  (shop)/
  (admin)/
  api/
components/
  admin/
  providers/
  sections/
  ui/
config/
constants/
context/
hooks/
lib/
  payment/
models/
public/
scripts/
services/
styles/
types/
```

## Tech Stack

- Frontend: Next.js 16.2.1, React 19.2.4, TypeScript, Tailwind CSS 4.2.2
- UI: shadcn-style components with Radix primitives
- Backend: Next.js route handlers
- Database: MongoDB Atlas + Mongoose 9.3.3
- Auth: JWT + refresh token cookies
- Media: Cloudinary
- Email: `EMAIL_SERVER` supports either `resend://YOUR_API_KEY` or an SMTP URL for Nodemailer
- Payments: Razorpay + Cashfree
- Deployment: Vercel

## Environment Variables

Copy `.env.example` to `.env.local` and populate:

```env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
CLOUDINARY_URL=
EMAIL_SERVER=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_ANALYTICS_ID=
```

Notes:

- `JWT_SECRET` and `JWT_REFRESH_SECRET` should each be long, random strings.
- `EMAIL_SERVER` can be `resend://re_xxx` or an SMTP DSN like `smtps://user:pass@smtp.example.com:465`.
- `NEXT_PUBLIC_BASE_URL` must match the deployed site URL for password resets and payment return URLs.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Seed optional demo data:

```bash
npm run seed:demo
```

4. Create the first admin user:

```bash
npm run seed:admin -- --email admin@sciencekit.in --password StrongPass123!
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Whitelist your local IP and Vercel deployment IPs as required.
4. Copy the connection string into `MONGODB_URI`.
5. Use a dedicated database name such as `sciencekit`.

## Razorpay Integration Guide

1. Create a Razorpay account and generate API keys.
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. The checkout page calls `/api/payments/create-order`, receives the public `keyId`, opens the Razorpay Checkout SDK, and then sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to the final order creation endpoint.
4. The server verifies the Razorpay signature before creating the order record.

## Cashfree Integration Guide

1. Create a Cashfree PG app and copy the app ID and secret key.
2. Set `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`.
3. The checkout page creates a Cashfree payment session through `/api/payments/create-order`.
4. After Cashfree redirects back to `/checkout?cashfree_order_id=...`, the app verifies the order status server-side before creating the local order.

## Cloudinary Media Setup

1. Create a Cloudinary product environment.
2. Copy the full connection string into `CLOUDINARY_URL`.
3. Use the admin Cloudinary uploader helper in the Products and Banners pages to upload images and paste returned URLs into the CRUD forms.

## Vercel Deployment Guide

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.example` to the Vercel project.
4. Set the production `NEXT_PUBLIC_BASE_URL` to your live domain.
5. Deploy.
6. Re-run the admin seed script against the production database, or promote an existing user record to `admin`.

## Admin Credentials Setup

Recommended workflow:

```bash
npm run seed:admin -- --email admin@sciencekit.in --password StrongPass123! --name "ScienceKit Admin"
```

This command upserts the admin user and ensures the role is `admin`.

## Operational Notes

- CSRF protection uses a double-submit cookie strategy and secure request header validation.
- Rate limiting is persisted in MongoDB via a TTL collection so it survives serverless cold starts.
- Stock alerts are collected per email/product and automatically notified when an admin restores stock above zero.
- Invoices are generated dynamically as PDFs from the order detail route.

## Production Hardening Suggestions

- Add payment webhooks for asynchronous reconciliation and refunds.
- Add image transformation presets in Cloudinary for product thumbnails and webp delivery.
- Add a dedicated audit view for contact messages and stock alerts if your ops team uses them daily.
- Replace direct HTML blog/product editing with a sanitized rich-text editor if non-admin contributors will use the CMS.

# Bulk Category Importer (Auto Product Import System)

## Features
- Paste any supplier/e-commerce category URL, import all products (with pagination)
- Background queue (BullMQ/Redis)
- Anti-block (random delay, user-agent rotation, retries, concurrency limit)
- Duplicate detection (slug, title, URL)
- Price marked as pending, separate price editor
- Import status tracking (ImportJob schema)
- Pause/Resume/Cancel, re-import, import history, export CSV (scaffolded for extension)

## File Structure
- `/api/bulk-import/start` — Start import job
- `/api/bulk-import/status` — Get job status
- `/api/bulk-import/worker` — Background worker
- `/lib/crawler.ts` — Crawler logic
- `/lib/queue.ts` — Queue/anti-block logic
- `/lib/dedup.ts` — Duplicate detection
- `/components/admin/bulk-import.tsx` — Admin UI
- `/components/admin/price-editor.tsx` — Price editor UI
- `/models/ImportJob.ts` — Import job schema

## Usage
- Go to Admin → Bulk Import to start a job
- Go to Admin → Bulk Price Editor to set prices for imported products

## TODO
- Implement site-specific crawling logic in `crawler.ts`
- Implement product extraction and Cloudinary upload in worker
- Add pause/resume/cancel endpoints and UI
- Add import history and CSV export
