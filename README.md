# INIT QR Code Generator & Attendance Scanner

A lightweight, client-side web application for generating QR codes from roll numbers and scanning them for attendance tracking.

## Features

- **QR Code Generator** — Enter any roll number and instantly generate a downloadable QR code
- **Attendance Scanner** — Scan QR codes using your device camera to mark attendance
- **Duplicate Prevention** — Automatically detects and prevents duplicate scans
- **CSV Export** — Export attendance records as a CSV file
- **Dark Theme** — Premium, modern dark UI design
- **Fully Offline** — No backend or database required

## Quick Start

1. Clone the repository
2. Open `index.html` in your browser (or use a local server)
3. Enter a roll number to generate a QR code

### Admin Access (Scanner)

Type `bhargi` in the roll number field to access the attendance scanner.

## Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) — QR code generation
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — QR code scanning

## File Structure

```
├── index.html          # QR Code Generator (Home)
├── scanner.html        # Attendance Scanner
├── css/
│   └── styles.css      # Global dark theme styles
├── js/
│   ├── generator.js    # QR generation logic
│   └── scanner.js      # Scanning & attendance logic
├── Members.csv         # Member reference data
├── PRD.md              # Product Requirements Document
└── README.md           # This file
```

## License

MIT
