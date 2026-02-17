/**
 * INIT QR Code Generator — Generator Logic
 * Matches the NSS system behavior: modal-based QR display, secret keyword redirect.
 */

// ========================================
// Config
// ========================================
const SECRET_KEYWORD = 'bhargi';

// ========================================
// DOM
// ========================================
const rollInput = document.getElementById('rollInput');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const errorMsg = document.getElementById('errorMsg');

// Modal
const qrModal = document.getElementById('qrModal');
const qrImageContainer = document.getElementById('qrImageContainer');
const qrRollLabel = document.getElementById('qrRollLabel');
const downloadBtn = document.getElementById('downloadBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// ========================================
// State
// ========================================
let qrInstance = null;

// ========================================
// Validation
// ========================================
function validate(value) {
    const trimmed = value.trim();
    if (!trimmed) return { ok: false, error: 'Please enter a roll number.' };
    if (trimmed.length < 5 || trimmed.length > 20) return { ok: false, error: 'Roll number must be between 5 and 20 characters.' };
    if (!/^[a-zA-Z0-9.\-]+$/.test(trimmed)) return { ok: false, error: 'Roll number must contain only letters, numbers, dots, and hyphens.' };
    return { ok: true, value: trimmed.toUpperCase() };
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
}

// ========================================
// Secret keyword check
// ========================================
function isSecretKeyword(value) {
    return value.trim().toLowerCase() === SECRET_KEYWORD;
}

// ========================================
// QR Generation (into modal)
// ========================================
function generateQR(rollNumber) {
    // Clear previous
    qrImageContainer.innerHTML = '';
    qrInstance = null;

    // Generate
    qrInstance = new QRCode(qrImageContainer, {
        text: rollNumber,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });

    // Style the generated image/canvas
    setTimeout(() => {
        const img = qrImageContainer.querySelector('img');
        const canvas = qrImageContainer.querySelector('canvas');
        if (img) {
            img.classList.add('qr-image');
            img.style.width = '220px';
            img.style.height = '220px';
        }
        if (canvas) {
            canvas.classList.add('qr-image');
        }
    }, 50);

    qrRollLabel.textContent = rollNumber;
    openModal();
}

// ========================================
// Modal Controls
// ========================================
function openModal() {
    qrModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    qrModal.classList.add('hidden');
    document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);

// Close on overlay click
qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !qrModal.classList.contains('hidden')) {
        closeModal();
    }
});

// ========================================
// Download
// ========================================
downloadBtn.addEventListener('click', () => {
    const canvas = qrImageContainer.querySelector('canvas');
    if (!canvas) return;

    const rollNumber = qrRollLabel.textContent;
    const link = document.createElement('a');
    link.download = `${rollNumber}_qr.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// ========================================
// Input handlers
// ========================================
rollInput.addEventListener('input', () => {
    clearError();
    const val = rollInput.value.trim().toLowerCase();
    // Don't auto-capitalize if typing the secret keyword
    if (val === SECRET_KEYWORD || SECRET_KEYWORD.startsWith(val)) return;
    rollInput.value = rollInput.value.toUpperCase();
});

rollInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generateBtn.click();
    }
});

// ========================================
// Generate button
// ========================================
generateBtn.addEventListener('click', () => {
    clearError();
    const inputValue = rollInput.value;

    // Secret keyword check
    if (isSecretKeyword(inputValue)) {
        window.location.href = 'scanner.html';
        return;
    }

    // Validate
    const result = validate(inputValue);
    if (!result.ok) {
        showError(result.error);
        return;
    }

    generateQR(result.value);
});
