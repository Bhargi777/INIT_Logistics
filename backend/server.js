const express = require("express");
const cors = require("cors");
const qrRoutes = require("./routes/qr");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", qrRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "INIT QR Generator API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
