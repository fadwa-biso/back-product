const express = require("express");
const dotenv = require("dotenv");
const globalMiddleware = require("./middlewares/global.middleware");
const cors = require('cors');
const connectDB = require("./config/db.connect");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const pharmacyRoutes = require("./routes/pharmacy.routes");
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const pharmacyStockRoutes = require("./routes/pharmacyStock.routes");
const notificationRoutes = require("./routes/notification.routes");
const watchlistRoutes = require("./routes/watchlist.routes");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Connect to database
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Built-in middlewares
app.use(express.json()); // Important for parsing JSON request bodies
app.use(globalMiddleware);


// Routes
// Auth routes
app.use("/api/auth", authRoutes);
// Admin routes
app.use("/api/admin", adminRoutes);
// Pharmacy routes
app.use("/api/pharmacies", pharmacyRoutes);

// ___cart routes_____

// app.use('/api/cart', cartRoutes);
app.use('/api/cart', cartRoutes);
// _______Order routes_________
app.use('/api/orders', orderRoutes);

// ______ PATIENT PROFILE ROUTES ______
app.use("/api", require("./routes/patient.profile.routes"));
// ______ USER PROFILE ROUTES ______
app.use("/api", require("./routes/user.profile.routes"));

//  Medicines Routes
app.use("/api/products", productRoutes);
// Error handler
app.use(errorHandler);

// ___________PHARMACY STOCK ROUTES___________
app.use("/api/pharmacy-stock", pharmacyStockRoutes);

// ___________NOTIFICATION ROUTES___________
app.use("/api/notifications", notificationRoutes);

// ___________WATCHLIST ROUTES___________
app.use("/api/watchlist", watchlistRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
