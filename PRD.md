# 📄 Product Requirements Document (PRD)

## Project Name: INIT QR Code Generator & Attendance Scanner

---

# 1. Overview

## 1.1 Purpose

Build a lightweight, static web application for the INIT NSS Attendance System with two core features:
1. **QR Code Generator**: Generate and download a basic QR code for any roll number.
2. **Attendance Scanner**: Scan QR codes to mark attendance with duplicate prevention and CSV export.

The system uses a **pure dark theme** (black aesthetic) and is a fully client-side application — no backend or database required.

---

# 2. Goals

### Primary Goals

1. **QR Generation**:
    - Generate a basic QR code from an entered roll number.
    - No logo embedding — clean, standard QR codes.
    - Allow download as PNG.
2. **Attendance Scanning** (Admin-only via secret keyword):
    - Scan QR codes using the device camera.
    - Support manual entry of roll numbers.
    - Prevent duplicate entries.
    - Export attendance data as CSV.
3. **Secret Admin Access**:
    - Typing `bhargi` in the roll number field redirects to the Scanner page.

### Secondary Goals

- **Pure Dark Theme**: A premium, all-black aesthetic with subtle gradients and animations.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Haptic Feedback**: Vibration cues for successful scans and errors on mobile.

---

# 3. Functional Requirements

## 3.1 User Flows

### A. Student / General User
1. User visits homepage (`index.html`).
2. User enters their roll number (e.g., `CB.EN.U4CSE12345`).
3. User clicks "Generate QR Code".
4. System generates and displays a basic QR code.
5. User can download the QR image as PNG.

### B. Admin / Scanner Access
1. User types the secret keyword `bhargi` in the roll number input.
2. System redirects to the Scanner page (`scanner.html`).
3. **Live Scanner**:
    - User enables camera permissions.
    - Scans a valid QR code.
    - System checks for duplicates and adds to the attendance list.
4. **Manual Entry**:
    - User types a roll number manually if scanning fails.
5. **Data Management**:
    - User views the list of scanned roll numbers.
    - User exports the list to CSV.
    - User can clear all records (with confirmation).

---

# 4. Input & Data Specifications

## 4.1 Roll Number Validation
- **Format**: Alphanumeric, dots, hyphens allowed.
- **Length**: 5–20 characters.
- **Special Case**: Input `bhargi` (case-insensitive) triggers admin redirect.

## 4.2 QR Code Configuration
- **Content**: Plain text of the roll number.
- **Type**: Basic black-and-white QR code (no logo overlay).
- **Library**: `qrcode.js` or equivalent client-side library.

---

# 5. Non-Functional Requirements

## 5.1 UI/UX Design
- **Theme**: Pure Dark Theme (black background `#000000`).
- **Aesthetics**: Glassmorphism effects, subtle gradient orbs, smooth transitions.
- **Feedback**:
    - **Visual**: Toast notifications for errors and success.
    - **Haptic**: Vibration patterns for success (short) vs. error (long/double).

## 5.2 Performance
- Fully client-side — no server or database dependency.
- QR Generation: Instant (client-side).
- Scanner FPS: ~10 frames per second.

---

# 6. Technical Architecture

## 6.1 Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript.
- **Libraries**:
    - `qrcodejs` (QR Code generation).
    - `html5-qrcode` (QR Code scanning).
- **No backend or database** — fully static.

## 6.2 File Structure

```
.
├── index.html          # Home / QR Generator page
├── scanner.html        # Attendance Scanner page
├── css/
│   └── styles.css      # Global styles (dark theme)
├── js/
│   ├── generator.js    # QR generation logic
│   └── scanner.js      # QR scanning + attendance logic
├── Members.csv         # Member reference data
├── PRD.md              # This document
└── README.md           # Project setup instructions
```

---

# 7. Deployment

- **Hosting**: GitHub Pages or any static file server.
- **No build step required** — just serve the HTML files.

---

# 8. Future Roadmap

1. **Authentication**: Replace `bhargi` keyword with proper auth.
2. **Event Management**: Support multiple events/sessions.
3. **Analytics Dashboard**: Visual stats of attendance.
4. **Cloud Sync**: Optional Supabase integration for persistent storage.
