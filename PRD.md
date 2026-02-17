# 📄 Product Requirements Document (PRD)

## Project Name: INIT QR Code Generator & Attendance Scanner

---

# 1. Overview

## 1.1 Purpose

Build a full-stack web application for the INIT Attendance System with two core features:
1. **QR Code Generator**: Generate and download a basic QR code for any roll number.
2. **Attendance Scanner**: Scan QR codes to mark attendance with Supabase cloud storage.

The system uses a **strict black-and-white theme** and is deployed across **Vercel** (frontend), **Render** (backend), and **Supabase** (database).

---

# 2. Goals

### Primary Goals

1. **QR Generation**:
    - Generate a basic QR code from an entered roll number (via backend API).
    - No logo embedding — clean, standard QR codes.
    - Display in a modal overlay and allow download as PNG.
2. **Attendance Scanning** (Admin-only via secret keyword):
    - Scan QR codes using the device camera.
    - Support manual entry of roll numbers.
    - Prevent duplicate entries (local + Supabase unique constraint).
    - Real-time sync with Supabase.
    - Export attendance data as CSV.
3. **Secret Admin Access**:
    - Typing `bhargi` in the roll number field redirects to the Scanner page.

### Secondary Goals

- **Black & White Theme**: Strict monochrome design — only black and white shades.
- **Responsive Design**: Optimized for both desktop and mobile.
- **Haptic Feedback**: Vibration cues for scans and errors on mobile.

---

# 3. Functional Requirements

## 3.1 User Flows

### A. Student / General User
1. User visits homepage.
2. User enters their roll number.
3. User clicks "Generate QR Code".
4. Backend generates QR and returns base64 PNG.
5. Modal displays QR code with download button.

### B. Admin / Scanner Access
1. User types `bhargi` in the roll number input.
2. System redirects to the Scanner page (`/scanner`).
3. **Live Scanner**: Camera-based QR scanning with duplicate detection.
4. **Manual Entry**: Type roll numbers manually.
5. **Data Management**: View records, export CSV, clear all.

---

# 4. Input & Data Specifications

## 4.1 Roll Number Validation
- **Format**: Alphanumeric, dots, hyphens allowed.
- **Length**: 5–20 characters.
- **Special Case**: Input `bhargi` (case-insensitive) triggers admin redirect.

## 4.2 QR Code Configuration
- **Content**: Plain text of the roll number.
- **Type**: Basic black-and-white QR code (no logo overlay).
- **Error Correction**: Medium (M).

## 4.3 Database Schema (Supabase)
**Table**: `attendance`

| Column        | Type        | Constraints      |
| ------------- | ----------- | ---------------- |
| `id`          | UUID        | Primary Key      |
| `roll_number` | Text        | Unique, Not Null |
| `scanned_at`  | Timestamptz | Default: `now()` |

---

# 5. Non-Functional Requirements

## 5.1 UI/UX Design
- **Theme**: Strict black (`#000000`) and white (`#ededed`) only.
- **Aesthetics**: Glassmorphism cards, subtle white/gray borders, smooth transitions.
- **Feedback**: Error modals (auto-dismiss 3s), haptic vibration.

## 5.2 Performance
- QR Generation: Server-side via Express API.
- Scanner FPS: ~10 frames per second.
- Supabase Realtime: Instant updates across connected clients.

---

# 6. Technical Architecture

## 6.1 Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS v4, TypeScript.
- **Backend**: Express.js (Node.js).
- **Database**: Supabase (PostgreSQL).
- **Libraries**:
    - `html5-qrcode` (Scanning).
    - `qrcode` (Generation - backend).
    - `@supabase/supabase-js` (DB client).

## 6.2 Folder Structure

```
.
├── backend/
│   ├── routes/
│   │     └── qr.js        # QR Generation API
│   ├── server.js           # Express Server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │     ├── globals.css   # Global Styles
│   │     ├── layout.tsx    # Root Layout
│   │     ├── page.tsx      # Home / Generator
│   │     └── scanner/
│   │           └── page.tsx # Scanner Dashboard
│   ├── components/
│   │     └── QRModal.tsx   # QR Display Modal
│   ├── lib/
│   │     └── supabase.ts   # Supabase Client
│   ├── services/
│   │     └── api.ts        # Backend API calls
│   ├── package.json
│   └── .env.example
├── Members.csv
├── PRD.md
└── README.md
```

---

# 7. Deployment

- **Frontend**: Vercel (auto-deploys from `frontend/` directory).
- **Backend**: Render (deploys `backend/` directory).
- **Database**: Supabase Cloud.

### Environment Variables

**Frontend (Vercel)**:
- `NEXT_PUBLIC_BACKEND_URL` — Render backend URL
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

**Backend (Render)**:
- `PORT` — Server port (default: 5000)

---

# 8. Future Roadmap

1. **Authentication**: Replace `bhargi` keyword with proper Supabase Auth.
2. **Event Management**: Support multiple events/sessions.
3. **Analytics Dashboard**: Visual stats of attendance.
