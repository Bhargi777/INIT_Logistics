/**
 * INIT Attendance Scanner - Scanner Logic
 * Handles QR code scanning, duplicate detection, attendance management, and CSV export.
 */

// ========================================
// State
// ========================================
let attendanceLog = [];
let html5QrCode = null;
let isScanning = false;

// ========================================
// DOM Elements
// ========================================
const toastContainer = document.getElementById('toastContainer');
const attendanceList = document.getElementById('attendanceList');
const attendanceCount = document.getElementById('attendanceCount');
const emptyState = document.getElementById('emptyState');
const statusDot = document.getElementById('statusDot');
const manualRollInput = document.getElementById('manualRollInput');

// ========================================
// Toast Notification System
// ========================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// Haptic Feedback
// ========================================
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

function vibrateSuccess() {
    vibrate(100); // Short buzz
}

function vibrateError() {
    vibrate([100, 50, 100]); // Double buzz
}

// ========================================
// Scanner Controls
// ========================================
function startScanner() {
    if (isScanning) return;

    html5QrCode = new Html5Qrcode('reader');

    html5QrCode.start(
        { facingMode: 'environment' },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        },
        onScanSuccess,
        onScanFailure
    ).then(() => {
        isScanning = true;
        statusDot.className = 'status-dot active';
        showToast('Camera started', 'success');
    }).catch((err) => {
        console.error('Camera error:', err);
        showToast('Failed to start camera. Check permissions.', 'error');
        vibrateError();
    });
}

function stopScanner() {
    if (!isScanning || !html5QrCode) return;

    html5QrCode.stop().then(() => {
        html5QrCode.clear();
        html5QrCode = null;
        isScanning = false;
        statusDot.className = 'status-dot inactive';
        showToast('Camera stopped', 'info');
    }).catch((err) => {
        console.error('Stop error:', err);
    });
}

// ========================================
// Scan Callbacks
// ========================================
function onScanSuccess(decodedText) {
    // Extract roll number from QR data
    const rollNumber = decodedText.trim().toUpperCase();

    if (!rollNumber || rollNumber.length < 3) {
        return; // Ignore empty/short reads
    }

    addAttendanceEntry(rollNumber);
}

function onScanFailure(errorMessage) {
    // Silent — no action on scan failures (continuous scanning)
}

// ========================================
// Add Attendance Entry
// ========================================
function addAttendanceEntry(rollNumber) {
    const cleaned = rollNumber.trim().toUpperCase();

    if (!cleaned || cleaned.length < 3) {
        showToast('Invalid roll number.', 'error');
        vibrateError();
        return;
    }

    // Check for duplicates
    const isDuplicate = attendanceLog.some(entry => entry.roll === cleaned);
    if (isDuplicate) {
        showToast(`Duplicate: ${cleaned} already scanned!`, 'error');
        vibrateError();
        return;
    }

    // Add to log
    const entry = {
        roll: cleaned,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };

    attendanceLog.push(entry);
    vibrateSuccess();
    showToast(`Added: ${cleaned}`, 'success');

    // Update UI
    renderAttendanceList();
}

// ========================================
// Manual Entry
// ========================================
function addManualEntry() {
    const value = manualRollInput.value.trim();

    if (!value) {
        showToast('Please enter a roll number.', 'error');
        return;
    }

    addAttendanceEntry(value);
    manualRollInput.value = '';
    manualRollInput.focus();
}

// Allow Enter key for manual entry
manualRollInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addManualEntry();
    }
});

// Auto-capitalize
manualRollInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

// ========================================
// Render Attendance List
// ========================================
function renderAttendanceList() {
    // Update count badge
    attendanceCount.textContent = attendanceLog.length;

    // Toggle empty state
    if (attendanceLog.length === 0) {
        emptyState.style.display = 'block';
        attendanceList.querySelectorAll('.attendance-item').forEach(el => el.remove());
        return;
    }

    emptyState.style.display = 'none';

    // Clear existing items (except empty state)
    attendanceList.querySelectorAll('.attendance-item').forEach(el => el.remove());

    // Render entries in reverse (newest first)
    [...attendanceLog].reverse().forEach((entry) => {
        const item = document.createElement('div');
        item.className = 'attendance-item';
        item.innerHTML = `
            <span class="attendance-roll">${entry.roll}</span>
            <span class="attendance-time">${entry.time}</span>
        `;
        attendanceList.appendChild(item);
    });
}

// ========================================
// Export CSV
// ========================================
function exportCSV() {
    if (attendanceLog.length === 0) {
        showToast('No attendance data to export.', 'error');
        return;
    }

    let csv = 'Roll Number,Time\n';
    attendanceLog.forEach(entry => {
        csv += `"${entry.roll}","${entry.time}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `INIT_Attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    showToast(`Exported ${attendanceLog.length} entries!`, 'success');
}

// ========================================
// Clear All
// ========================================
function clearAll() {
    if (attendanceLog.length === 0) {
        showToast('No data to clear.', 'info');
        return;
    }

    const confirmed = confirm(
        `This will permanently clear ${attendanceLog.length} attendance record(s).\n\nProceed?`
    );

    if (!confirmed) return;

    attendanceLog = [];
    renderAttendanceList();
    showToast('All records cleared.', 'info');
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    renderAttendanceList();
});
