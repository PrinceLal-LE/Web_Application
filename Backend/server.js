// Backend/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const routers = require('./router/auth-router');
const connectDB = require('./utils/database');
const checkboxOptionsRouter = require('./router/postDialougeBox-router');
const helmet = require('helmet');
const path = require('path');
const profileRouter = require('./router/profile-router');
const cors = require('cors');
const fs = require('fs'); // Import fs module


const allowedOrigins = [
  'http://localhost:5173',           // Your frontend development URL
  'https://yourproductiondomain.com', // Your production frontend URL
  'https://anotheralloweddomain.com'  // Any other specific domains you want to allow
];

// Global Middleware - This applies to all routes, including API. Keep it.
// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our allowedOrigins list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet()); // Helmet can sometimes interfere with static assets. Keep an eye on it.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../eRepo');

// Ensure the eRepo directory exists
if (!fs.existsSync(eRepoPath)) {
  fs.mkdirSync(eRepoPath, { recursive: true });
}

// *** CRITICAL CHANGE HERE ***
// Apply CORS specifically to the static file serving middleware.
// This ensures that the Access-Control-Allow-Origin header is explicitly set for images.
// Apply CORS specifically to the static file serving middleware with the same logic
app.use('/eRepo', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS for static files'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}), express.static(eRepoPath));


// API Routers
app.use("/api/auth", routers);
app.use("/api", checkboxOptionsRouter);
app.use("/api/profile", profileRouter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Prince Lal" });
});

// port number
connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => { // Add default port just in case .env isn't loaded
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
  });
});