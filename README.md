# INIT QR Code Generator & Attendance Scanner

A full-stack attendance system with QR code generation and real-time scanning, built with Next.js, Express, and Supabase.

## Architecture

| Layer      | Tech               | Deployment |
|------------|--------------------| -----------|
| Frontend   | Next.js + TypeScript + TailwindCSS | Vercel |
| Backend    | Express.js + Node.js               | Render |
| Database   | PostgreSQL                          | Supabase |

## Features

- **QR Code Generator** — Enter a roll number, get a downloadable QR code
- **Attendance Scanner** — Scan QR codes with device camera
- **Supabase Realtime** — Instant cloud sync across all connected clients
- **Duplicate Prevention** — Local + database-level unique constraints
- **CSV Export** — Export attendance records with timestamps
- **B&W Design** — Strict black-and-white monochrome theme

## Quick Start

### Backend (Render)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend (Vercel)

```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

### Supabase Setup

Create an `attendance` table:

```sql
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number TEXT UNIQUE NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
```

### Admin Access

Type `bhargi` in the roll number field to access the scanner.

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL (Render) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

### Backend

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |

## Deployment

1. **Supabase**: Create project → Run the SQL above → Copy URL + anon key.
2. **Render**: Deploy `backend/` → Set `PORT` env var.
3. **Vercel**: Deploy `frontend/` → Set all `NEXT_PUBLIC_*` env vars.

## License

MIT
