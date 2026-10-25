require("dotenv").config();
require("reflect-metadata");

const express = require("express");
const cors = require("cors");
const path = require("path");

const AppDataSource = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

// --- LOCAL DEVELOPMENT CORS CONFIGURATION ---
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Allow standard frontend development ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.options('*', cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/claims", require("./src/routes/claimRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Error Handler Middleware
app.use(errorHandler);



// Initialize Database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected to local PostgreSQL");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Local server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Database connection error:", err));

module.exports = app;