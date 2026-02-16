/**
 * INIT QR Code Generator - Generator Logic
 * Handles QR code generation, validation, and download.
 */

// ========================================
// Configuration
// ========================================
const SECRET_KEYWORD = 'bhargi';
const ROLL_MIN_LENGTH = 5;
const ROLL_MAX_LENGTH = 20;
const ROLL_PATTERN = /^[A-Za-z0-9.\-]+$/;

// ========================================
// DOM Elements
// ========================================
const qrForm = document.getElementById('qrForm');
const rollInput = document.getElementById('rollNumberInput');
const generateBtn = document.getElementById('generateBtn');
const qrOutput = document.getElementById('qrOutput');
const qrCanvasWrap = document.getElementById('qrCanvasWrap');
const qrRollLabel = document.getElementById('qrRollLabel');
const downloadBtn = document.getElementById('downloadBtn');
const toastContainer = document.getElementById('toastContainer');

// ========================================
// QR Code Instance
// ========================================
let qrInstance = null;

// ========================================
// Toast Notification System
// ========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// Validation
// ========================================
function validateRollNumber(value) {
    if (!value || value.trim().length === 0) {
        return { valid: false, error: 'Please enter a roll number.' };
    }

    const trimmed = value.trim();

    if (trimmed.length < ROLL_MIN_LENGTH) {
        return { valid: false, error: `Roll number must be at least ${ROLL_MIN_LENGTH} characters.` };
    }

    if (trimmed.length > ROLL_MAX_LENGTH) {
        return { valid: false, error: `Roll number must be at most ${ROLL_MAX_LENGTH} characters.` };
    }

    if (!ROLL_PATTERN.test(trimmed)) {
        return { valid: false, error: 'Roll number can only contain letters, numbers, dots, and hyphens.' };
    }

    return { valid: true, value: trimmed.toUpperCase() };
}

// ========================================
// Secret Keyword Check
// ========================================
function checkSecretKeyword(value) {
    return value.trim().toLowerCase() === SECRET_KEYWORD;
}

// ========================================
// QR Code Generation
// ========================================
function generateQRCode(rollNumber) {
    // Clear previous QR code
    qrCanvasWrap.innerHTML = '';
    qrInstance = null;

    // Create new QR code
    qrInstance = new QRCode(qrCanvasWrap, {
        text: rollNumber,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });

    // Update label
    qrRollLabel.textContent = rollNumber;

    // Show output section
    qrOutput.classList.add('visible');

    showToast('QR Code generated successfully!', 'success');
}

// ========================================
// Download QR Code
// ========================================
function downloadQR() {
    const canvas = qrCanvasWrap.querySelector('canvas');
    if (!canvas) {
        showToast('No QR code to download.', 'error');
        return;
    }

    const rollNumber = qrRollLabel.textContent;
    const link = document.createElement('a');
    link.download = `QR_${rollNumber}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('QR Code downloaded!', 'success');
}

// ========================================
// Auto-capitalize Input
// ========================================
rollInput.addEventListener('input', (e) => {
    // Don't auto-capitalize if it might be the secret keyword
    const val = e.target.value.trim().toLowerCase();
    if (val === SECRET_KEYWORD || SECRET_KEYWORD.startsWith(val)) {
        return;
    }
    e.target.value = e.target.value.toUpperCase();
});

// ========================================
// Form Submit Handler
// ========================================
qrForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = rollInput.value;

    // Check for secret keyword first
    if (checkSecretKeyword(inputValue)) {
        showToast('Redirecting to scanner...', 'info');
        setTimeout(() => {
            window.location.href = 'scanner.html';
        }, 500);
        return;
    }

    // Validate roll number
    const validation = validateRollNumber(inputValue);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        return;
    }

    // Generate QR code
    generateQRCode(validation.value);
});

// ========================================
// Download Button Handler
// ========================================
downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    downloadQR();
});
