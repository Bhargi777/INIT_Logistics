
# 📄 Product Requirements Document (PRD)

## Project Name: Amrita Roll Number QR Generator & Scanner

---

# 1. Overview

## 1.1 Purpose

Build a comprehensive web application for the NSS Attendance System that serves two main roles:
1.  **Student Role**: Generate and download a QR code for their roll number.
2.  **Admin Role**: Scan QR codes to mark attendance and sync data to the cloud.

The system features a **pure darker theme** (black aesthetic) and integrates with **Supabase** for real-time data storage.

---

# 2. Goals

### Primary Goals

1.  **QR Generation**:
    *   Generate QR code based on entered roll number.
    *   Embed Amrita logo above the QR.
    *   Allow download as PNG.
2.  **Attendance Scanning**:
    *   Scan QR codes using the device camera.
    *   Support manual entry of roll numbers.
    *   Prevent duplicate entries (local and cloud checks).
    *   Store attendance records in Supabase.
3.  **Data Management**:
    *   Real-time sync with Supabase.
    *   Export attendance data as CSV.
    *   View and delete records.

### Secondary Goals

*   **Pure Darker Theme**: A premium, all-black aesthetic (`#000000`) with subtle gradients and animations.
*   **Responsive Design**: optimized for both desktop and mobile devices.
*   **Haptic Feedback**: Vibration queues for successful scans and errors.

---

# 3. Functional Requirements

## 3.1 User Flows

### A. Student / General User
1.  User visits homepage (`/`).
2.  User enters roll number (e.g., `CB.EN.U4CSE12345`).
3.  User clicks "Generate QR".
4.  System displays a modal with the generated QR code (logo embedded).
5.  User can download the QR image.

### B. Admin / Scanner Access
1.  User enters the secret code `bhargi` in the roll number input on the homepage.
2.  System redirects to the Scanner Dashboard (`/scanner`).
3.  **Live Scanner**:
    *   User enables camera permissions.
    *   Scans a valid QR code.
    *   System checks for duplicates and adds to the list.
    *   System pushes data to Supabase.
4.  **Manual Entry**:
    *   User types a roll number manually if scanning fails.
5.  **Data Management**:
    *   User views the list of scanned roll numbers.
    *   User exports the list to CSV.
    *   User clears cloud data (with confirmation).

---

# 4. Input & Data Specifications

## 4.1 Roll Number Validation
*   **Format**: Alphanumeric, dots, hyphens allowed.
*   **Length**: 5–20 characters.
*   **Special Case**: Input `bhargi` triggers admin redirection.

## 4.2 QR Code Configuration
*   **Content**: Plain text specific to the roll number.
*   **Error Correction**: Medium (M).
*   **Styling**:
    *   Black foreground, White background.
    *   Amrita Logo embedded at the top (canvas composition).

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
*   **Theme**: Pure Darker Theme (`bg-black`).
*   **Aesthetics**: Glassmorphism effects, subtle gradient orbs (Red/Purple), smooth transitions.
*   **Feedback**:
    *   **Visual**: Toasts/Modals for errors (e.g., "Duplicate Found").
    *   **Haptic**: Vibration patterns for success (short) vs. error (long/double).

## 5.2 Performance
*   QR Generation: Client/Server optimized (Fast).
*   Scanner FPS: ~10 frames per second.
*   Supabase Realtime: Instant updates across connected clients.

---

# 6. Technical Architecture

## 6.1 Tech Stack
*   **Frontend**: Next.js (App Router), TailwindCSS (v4).
*   **Backend / API**: Node.js (QR Generation API).
*   **Database**: Supabase (PostgreSQL).
*   **Libraries**:
    *   `html5-qrcode` (Scanning).
    *   `qrcode` (Generation).
    *   `@supabase/supabase-js` (db client).
    *   `sharp` (Image composition - server side).

## 6.2 Folder Structure

```
.
├── backend/
│   ├── routes/
│   │     └── qr.js        # QR Generation Logic
│   └── server.js          # Express Server
├── frontend/
│   ├── app/
│   │     ├── globals.css  # Global Styles (Pure Black Theme)
│   │     ├── layout.tsx
│   │     ├── page.tsx     # Home / Generator
│   │     └── scanner/
│   │           └── page.tsx # Scanner Dashboard
│   ├── components/
│   │     └── QRModal.tsx
│   ├── lib/
│   │     └── supabase.ts  # Supabase Client
│   └── services/
│         └── api.ts       # API calls to backend
```

---

# 7. Deployment

*   **Frontend**: Vercel.
*   **Backend**: Render / Railway.
*   **Database**: Supabase Cloud.

---

# 8. Future Roadmap

1.  **Authentication**: Replace `bhargi` backdoor with proper Supabase Auth.
2.  **Event Management**: Support multiple events/sessions.
3.  **Analytics Dashboard**: Visual stats of attendance.
