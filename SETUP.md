# INIT Logistics — Deployment Setup Guide

Complete step-by-step guide to deploy the QR Attendance System using **Supabase** (database), **Render** (backend), and **Vercel** (frontend).

---

## Table of Contents

1. [Supabase Setup (Database)](#1-supabase-setup-database)
2. [Render Setup (Backend)](#2-render-setup-backend)
3. [Vercel Setup (Frontend)](#3-vercel-setup-frontend)
4. [Connect Everything](#4-connect-everything)
5. [Verify Deployment](#5-verify-deployment)

---

## 1. Supabase Setup (Database)

Supabase provides a hosted PostgreSQL database with realtime capabilities.

### Step 1: Create an Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** and sign up with GitHub

### Step 2: Create a New Project

1. Click **New Project**
2. Fill in:
   - **Name:** `init-logistics`
   - **Database Password:** Choose a strong password (save it somewhere safe)
   - **Region:** Choose the closest region to your users
3. Click **Create new project**
4. Wait for the project to finish provisioning (takes ~2 minutes)

### Step 3: Run the Migration

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the `supabase_migration.sql` file from this repo and copy its entire contents
4. Paste it into the SQL editor
5. Click **Run** (or press `Cmd + Enter`)
6. You should see `Success. No rows returned` — this means the table was created

### Step 4: Verify the Table

1. Go to **Table Editor** (left sidebar)
2. You should see the `attendance` table with columns:
   - `id` (UUID, primary key)
   - `roll_number` (text, unique)
   - `scanned_at` (timestamptz)

### Step 5: Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Note down these two values — you'll need them later:

| Key | Where to find it |
|-----|-----------------|
| **Project URL** | Under `Project URL` → looks like `https://xxxxxxxxxxxx.supabase.co` |
| **Anon Public Key** | Under `Project API keys` → the `anon` `public` key (starts with `eyJ...`) |

> ⚠️ Never share or expose the `service_role` key. The `anon` key is safe for frontend use.

---

## 2. Render Setup (Backend)

Render hosts the Express.js backend that generates QR codes.

### Step 1: Create an Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create a New Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub repository: `Bhargi777/INIT_Logistics`
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `init-logistics-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

4. Click **Create Web Service**

### Step 3: Wait for Deployment

1. Render will automatically build and deploy your backend
2. Once deployed, you'll get a URL like: `https://init-logistics-backend.onrender.com`
3. Visit the URL — you should see:
   ```json
   {"status":"ok","message":"QR Generator API is running"}
   ```

### Step 4: Note Your Backend URL

Save the Render URL — you'll need it for the frontend setup:
```
https://init-logistics-backend.onrender.com
```

> ⚠️ Free tier on Render spins down after 15 minutes of inactivity. The first request after spin-down takes ~30 seconds. This is normal.

---

## 3. Vercel Setup (Frontend)

Vercel hosts the Next.js frontend application.

### Step 1: Create an Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import the Project

1. Click **Add New** → **Project**
2. Find and import: `Bhargi777/INIT_Logistics`
3. Configure the project:

| Setting | Value |
|---------|-------|
| **Project Name** | `init-logistics` |
| **Framework Preset** | `Next.js` (auto-detected) |
| **Root Directory** | Click **Edit** → type `frontend` → click **Continue** |

### Step 3: Add Environment Variables

Before clicking deploy, add these environment variables:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | Your Render URL (e.g., `https://init-logistics-backend.onrender.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (e.g., `https://xxxxxxxxxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key (starts with `eyJ...`) |

> Click **Add** after each variable.

### Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete (~1-2 minutes)
3. Once deployed, you'll get a URL like: `https://init-logistics.vercel.app`

### Step 5: Verify

1. Visit your Vercel URL
2. You should see the QR Generator home page
3. Enter a test roll number and generate a QR code to verify the backend connection

---

## 4. Connect Everything

Here's how the three services connect:

```
┌─────────────────────┐
│   Vercel (Frontend)  │
│   Next.js App        │
│                      │
│  ┌────────────────┐  │
│  │ QR Generator   │──┼──→ Render (Backend) → generates QR image
│  │ Page           │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ Scanner Page   │──┼──→ Supabase (Database) → stores attendance
│  │                │  │    ↕ Realtime sync
│  └────────────────┘  │
│                      │
└─────────────────────┘
```

### Data Flow

1. **QR Generation:** Frontend → Render Backend → returns base64 QR image
2. **Scanning:** Frontend → Supabase directly → inserts into `attendance` table
3. **Realtime:** Supabase pushes changes → Frontend updates live table

---

## 5. Verify Deployment

Run through this checklist to make sure everything works:

- [ ] **Home Page loads** — Visit your Vercel URL
- [ ] **QR Code generates** — Enter any roll number (e.g., `CB.EN.U4CSE12345`) and click Generate
- [ ] **QR Modal appears** — Shows the QR code with download button
- [ ] **Scanner access works** — Type `bhargi` in the roll number field
- [ ] **Manual entry works** — Type a roll number in the scanner page and submit
- [ ] **Record appears in Supabase** — Check Table Editor in Supabase dashboard
- [ ] **Duplicate prevention works** — Try entering the same roll number twice
- [ ] **CSV export works** — Click Export .CSV with at least one entry
- [ ] **Clear All works** — Deletes all records from the table

---

## Troubleshooting

### "Could not connect to the server" on QR generation
- Check if your Render backend is running (visit the Render URL directly)
- Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel environment variables
- Make sure there's no trailing slash in the URL

### Scanner not saving to Supabase
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- Check that you ran the migration SQL in Supabase
- Go to Supabase → Table Editor → verify the `attendance` table exists

### Realtime not updating
- Go to Supabase → Database → Publications
- Make sure `supabase_realtime` publication includes the `attendance` table

### Render backend is slow on first load
- Free tier spins down after inactivity. First request takes ~30s to cold start
- This only affects QR generation, not scanning (scanning goes directly to Supabase)

### Environment variables not working after update
- In Vercel: Go to Settings → Environment Variables → update the values
- **Important:** Click **Redeploy** after changing environment variables (Deployments → three dots → Redeploy)

---

## Quick Reference

| Service | Dashboard URL | Purpose |
|---------|--------------|---------|
| **Supabase** | [app.supabase.com](https://app.supabase.com) | Database & Realtime |
| **Render** | [dashboard.render.com](https://dashboard.render.com) | Backend API |
| **Vercel** | [vercel.com/dashboard](https://vercel.com/dashboard) | Frontend Hosting |
