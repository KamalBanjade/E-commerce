const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");
const keysecret = "akldfjkdfkdfkdggkfjkdkadkfjirwekjrkdjfsd"
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Check if token exists and starts with "Bearer "
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ status: 401, message: "Unauthorized: No token provided" });
        }

        // Remove "Bearer " from the token
        const actualToken = token.split(' ')[1];

        const verifytoken = jwt.verify(actualToken, keysecret);

        const rootUser = await userdb.findOne({ _id: verifytoken._id });

        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = actualToken;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        // Provide more specific error messages for better debugging
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ status: 401, message: "Unauthorized: Invalid token" });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ status: 401, message: "Unauthorized: Token has expired" });
        }

        // Fallback for other errors
        res.status(401).json({ status: 401, message: error.message || "Unauthorized: An error occurred" });
    }
};

module.exports = authenticate;
