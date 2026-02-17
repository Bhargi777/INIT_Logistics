const express = require("express");
const QRCode = require("qrcode");

const router = express.Router();

// QR dimensions
const QR_SIZE = 300;

/**
 * Validate roll number input.
 * Alphanumeric, dots, and hyphens only, 5-20 characters.
 */
function validateRollNumber(rollNumber) {
    if (!rollNumber || typeof rollNumber !== "string") {
        return false;
    }
    const trimmed = rollNumber.trim();
    if (trimmed.length < 5 || trimmed.length > 20) {
        return false;
    }
    return /^[a-zA-Z0-9.\-]+$/.test(trimmed);
}

/**
 * POST /api/generate-qr
 * Accepts { rollNumber } and returns a base64-encoded PNG.
 * Basic QR code — no logo overlay.
 */
router.post("/generate-qr", async (req, res) => {
    try {
        const { rollNumber } = req.body;

        // Validate
        if (!validateRollNumber(rollNumber)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid roll number. Must be 5-20 alphanumeric characters (dots and hyphens allowed).",
            });
        }

        const trimmedRoll = rollNumber.trim();

        // Generate QR code as buffer (basic, no logo)
        const qrBuffer = await QRCode.toBuffer(trimmedRoll, {
            width: QR_SIZE,
            errorCorrectionLevel: "M",
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        const base64Image = qrBuffer.toString("base64");

        return res.json({
            success: true,
            image: base64Image,
        });
    } catch (error) {
        console.error("QR generation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate QR code. Please try again.",
        });
    }
});

module.exports = router;
