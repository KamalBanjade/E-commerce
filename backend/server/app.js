require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/conn"); // Ensure database connection
const router = require("./routes/router");
const reviewRouter = require("./routes/reviewRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 
const productRouter = require("./routes/productRouter");
const port = process.env.PORT || 8009;

// Middleware
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// Routes
app.use(router); 
app.use("/api", productRouter); // Prefix API routes for products
app.use("/api", reviewRouter); // Use review router with the same prefix

// Start the application only after the DB connection is successful
const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        
        // Start the server
        app.listen(port, () => {
            console.log(`Server started at port: ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit with failure if the DB connection fails
    }
};

// Call the function to start the server
startServer();
