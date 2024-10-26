const express = require('express');
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');
const router = express.Router();


router.post('/products/:productId/reviews', addReview);  // Add productId in the route for adding a review
router.get('/products/:productId/reviews', getReviews);  // Update the route to fetch reviews by productId
router.delete('/reviews/:id', deleteReview);  // Delete remains the same


module.exports = router;
