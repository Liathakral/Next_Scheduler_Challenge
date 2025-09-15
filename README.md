# 📅 Scheduler – Seller/Buyer Appointment Booking

## 🎥 Demo

<video src="example_wakthrough.mp4" controls width="600"></video>

A full-stack Next.js app with Google Calendar integration, Prisma + PostgreSQL, and authentication.  
Sellers can connect their Google Calendar, set availability, and buyers can book slots.

---

## 🚀 Features
- Google OAuth login (Seller/Buyer role-based)  
- Seller Dashboard with availability grid  
- Integration with Google Calendar (busy times auto-blocked)  
- Booking flow with conflict detection  
- Prisma ORM with PostgreSQL  

---

## 📦 Tech Stack
- **Next.js 13+ (App Router)**  
- **Prisma** + PostgreSQL  
- **Google APIs (OAuth + Calendar)**  
- **TailwindCSS**  
- Deploy-ready for **Vercel**  

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/scheduler.git
cd scheduler
```


```npm install
# or
yarn install
```


## 🔑 Environment Variables

Copy `.env.example` → `.env.local` and fill in values.

### `.env.example`
```env
# Database (Prisma Accelerate example)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Google OAuth credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# The redirect URI you registered in Google Cloud, e.g.:
# http://localhost:3000/api/auth/callback
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# Encryption key for sensitive data
ENCRYPTION_KEY="your-random-32-char-string"

# App base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# JWT secret for session handling
JWT_SECRET="your-random-secret"


4. Prisma setup

Generate client and run migrations:
```
npx prisma generate
npx prisma migrate dev --name init
```


. Run the app locally
```
npm run dev

```
Your app will be available at 👉 http://localhost:3000