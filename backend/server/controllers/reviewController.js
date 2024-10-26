const Review = require("../models/review");
const mongoose = require("mongoose");

// Add a new review (for a product in your local database or external Fakestore product)
const addReview = async (req, res) => {
    try {
        const { user, rating, comment } = req.body;
        const { productId } = req.params;  // Extract productId from URL parameters

        // Create a new review object
        const newReview = mongoose.Types.ObjectId.isValid(productId)
            ? new Review({ user, productId, rating, comment })  // For local products with MongoDB ObjectId
            : new Review({ user, externalProductId: parseInt(productId, 10), rating, comment });  // For external products

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review', details: error.message });
    }
};

// Get reviews for a product (local database product or external Fakestore product)
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        let reviews;
        if (mongoose.Types.ObjectId.isValid(productId)) {
            // If productId is a valid ObjectId, assume it's a local product
            reviews = await Review.find({ productId });
        } else if (!isNaN(productId)) {
            // If productId is numeric, assume it's an external product ID
            const externalProductId = parseInt(productId, 10);
            reviews = await Review.find({ externalProductId });
        } else {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
};

// Delete a review by review ID
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;  // Extract review ID from URL parameters
        await Review.findByIdAndDelete(id);

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review', details: error.message });
    }
};

module.exports = {
    addReview,
    getReviews,
    deleteReview
};
