// conn.js
const mongoose = require("mongoose");

const DB = "mongodb+srv://kamalbanjade:K%40M%40L@cluster0.sf0urdt.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log("Database Connected");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process with failure if the connection fails
    }
};

module.exports = connectDB;
