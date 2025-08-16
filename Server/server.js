require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

const connectDB = require("./db/connect");
const { seedDatabase } = require("./seed");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Import routers
const authRoutes = require("./routers/authRouters");
const userRoutes = require("./routers/userRoutes");
const petRoutes = require("./routers/petRoutes");
const bookingRoutes = require("./routers/bookingRoutes");
const healthRoutes = require("./routers/healthRoutes");
const trainingRoutes = require("./routers/trainingRoutes");
const notificationRoutes = require("./routers/notificationRoutes");
const donationRoutes = require("./routers/donationRoutes");
const adminRoutes = require("./routers/adminRoutes");

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Pet Management System API</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed database if empty
    // await seedDatabase();

    app.listen(port, () =>
      console.log(`🚀 Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error('❌ Server startup error:', error);
  }
};

start();
