const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "✅ Todo API is running",
    version: "1.0.0",
    endpoints: ["/api/users", "/api/todos", "/api/collections"],
  });
});

// Serve frontend for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.use("/api/users", require("./routes/users"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/collections", require("./routes/collections"));

app.listen(PORT, () => {
  console.log(`🚀 Todo server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
