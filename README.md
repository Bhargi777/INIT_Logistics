# INIT Logistics - QR Attendance System

A full-stack QR code-based attendance tracking system. Scan QR codes to record attendance in real-time with cloud sync.

## Features

- **QR Code Generation** — Generate QR codes from roll numbers
- **Live Scanner** — Camera-based QR code scanning
- **Manual Entry** — Type roll numbers manually as fallback
- **Duplicate Prevention** — Same roll number cannot be scanned twice
- **Realtime Sync** — Attendance records sync in real-time via Supabase
- **Export CSV** — Download attendance records as CSV
- **Delete & Clear** — Remove individual entries or clear all

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
**Backend:** Node.js, Express.js, qrcode, sharp  
**Database:** Supabase (PostgreSQL)  
**Deployment:** Vercel (frontend), Render (backend), Supabase (database)

## Database Schema

```
attendance — Roll numbers with scan timestamps (unique constraint)
```

## Project Structure

```
├── backend/
│   ├── server.js              # Express server entry point
│   ├── routes/
│   │   └── qr.js              # QR generation API route
│   ├── assets/
│   │   └── amrita-logo.png
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # QR Generator page
│   │   ├── scanner/
│   │   │   └── page.tsx        # QR Scanner page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── QRModal.tsx         # QR display modal
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── services/
│   │   └── api.ts              # Backend API service
│   └── package.json
├── supabase_migration.sql      # Database schema setup
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase project (free tier works)

### 1. Database Setup

1. Create a project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run `supabase_migration.sql` to create the attendance table

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:5000` by default.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Then start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Usage Flow

1. **Students** visit the home page and enter their roll number to generate a QR code
2. **Admin** types `bhargi` in the roll number field to access the scanner
3. **Scanning** — Launch camera and scan student QR codes or enter manually
4. **Auto-tracking** — Records are automatically synced to Supabase
5. **Export** — Download attendance as CSV

## API

### POST /api/generate-qr

**Request:**
```json
{
  "rollNumber": "CB.EN.U4CSE12345"
}
```

**Response (success):**
```json
{
  "success": true,
  "image": "<base64-encoded-png>"
}
```

## Deployment

- **Frontend:** Vercel (auto-deploys from GitHub)
- **Backend:** Render
- **Database:** Supabase
