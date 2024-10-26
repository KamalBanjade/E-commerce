import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addReviewForProduct, fetchReviewsForProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Load product and reviews on component mount
  useEffect(() => {
    const loadProductAndReviews = async () => {
      try {
        // Fetch product data
        const productData = await fetchProductById(id);
        setProduct(productData);

        // Fetch reviews for the product
        try {
          const productReviews = await fetchReviewsForProduct(id);
          setReviews(productReviews);
        } catch {
          setReviews([]); // Set to an empty array if fetching reviews fails
        }
      } catch (error) {
        console.error("Failed to load product or review data:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    };
    loadProductAndReviews();
}, [id]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login', { state: { message: 'Please login to add products to the cart.' } });
      toast.warn('Please login to add items to your cart');
    } else {
      addToCart(product);
      toast.success('Product added to cart');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
        navigate('/login', { state: { message: 'Please login to submit a review.' } });
        toast.warn('Please login to submit a review');
        return;
    }

    if (!newComment || newRating === 0) {
        toast.warn('Please provide a review and rating.');
        return;
    }

    // Ensure the id is correctly passed
    const reviewData = {
        user: currentUser._id,
        productId: id, // Ensure `id` is directly used here and is a string or number
        rating: newRating,
        comment: newComment,
    };

    try {
        const addedReview = await addReviewForProduct(id, reviewData); // Pass `id` directly
        setReviews([...reviews, addedReview]);
        setNewComment('');
        setNewRating(0);
        toast.success('Review submitted successfully!');
    } catch (error) {
        console.error('Failed to submit review', error);
        toast.error('Failed to submit review');
    }
};


  const renderStars = (rating, isStatic = false) => {
    const effectiveRating = hoverRating || newRating || rating;
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < effectiveRating ? 'star-filled' : 'star-empty'}
        onClick={() => !isStatic && setNewRating(i + 1)}
        onMouseEnter={() => !isStatic && setHoverRating(i + 1)}
        onMouseLeave={() => !isStatic && setHoverRating(0)}
        style={{ cursor: isStatic ? 'default' : 'pointer' }}
      />
    ));
  };

  return (
    <div className="product-details-container">
      <ToastContainer />
      <div className="product-details">
        <div className="product-image-container">
          <img src={product.image || '/placeholder.jpg'} alt={product.title || 'Product Image'} className="product-image" />
        </div>
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-rating">
            {renderStars(Math.round(product.rating?.rate || 0), true)}
            <span>({product.rating?.count || 0} reviews)</span>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="product-category">
            <h4>Category:</h4>
            <span className="product-category-label">{product.category || 'Uncategorized'}</span>
          </div>
          <h3 className="product-price">${product.price.toFixed(2)}</h3>
          <button className="product-button" onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.map((review, index) => (
    <div key={index} className="review-item">
        <img src="/placeholder.png" alt="Reviewer" />
        <div className="review-content">
            <h4>{review.user?.fname || 'Anonymous'}</h4>
            <div className="star-rating">{renderStars(review.rating, true)}</div>
            <p>{review.comment}</p>
        </div>
    </div>
))}



        <div className="add-review-section">
          <h4>Leave a Review</h4>
          {currentUser ? (
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review here"
                className="comment-textarea"
                rows="4"
                required
              ></textarea>
              <div className="select-rating">
                <div className="star-rating">{renderStars(hoverRating || newRating)}</div>
              </div>
              <button type="submit" className="submit-comment-button">
                Submit Review
              </button>
            </form>
          ) : (
            <p>Please <a href="/login">log in</a> to leave a review.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
