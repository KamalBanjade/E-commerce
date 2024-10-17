require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Corrected spelling
const port = process.env.PORT || 8009; // Use environment variable for port

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true // Allow cookies to be sent
}));

// Routes
app.use(router);

// Start server
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
