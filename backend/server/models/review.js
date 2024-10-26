// models/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Internal product ID
    externalProductId: { type: Number },  // External product ID (Fakestore)
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
