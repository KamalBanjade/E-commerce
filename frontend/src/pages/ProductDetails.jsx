import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      reviewer: 'John Doe',
      rating: 5,
      content: 'This product is amazing! Highly recommended.',
    },
  ]); // Placeholder review
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Failed to load product data');
        toast.error('Failed to load product data');
      }
    };

    loadProduct();
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
      navigate('/login', {
        state: { message: 'Please login to add products to the cart.' },
      });
      toast.warn('Please login to add items to your cart');
    } else {
      addToCart(product);
      toast.success('Product added to cart');
      // setTimeout(() => {
      //   navigate('/');
      // }, 2000);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      // If user is not logged in, redirect them to login
      toast.warn('Please login to submit a review.');
      navigate('/login', {
        state: { message: 'Please login to submit a review.' },
      });
      return;
    }

    if (!newComment || newRating === 0) {
      toast.warn('Please provide a review and rating.');
      return;
    }

    // Extract name from email (before the @)
    const nameFromEmail = currentUser.email.split('@')[0];

    const newReview = {
      reviewer: nameFromEmail,
      rating: newRating,
      content: newComment,
    };

    setReviews([...reviews, newReview]); // Append the new review
    setNewComment(''); // Reset the comment field
    setNewRating(0); // Reset the rating
    toast.success('Review submitted successfully!');
  };

  const renderStars = (rating, isStatic = false) => {
    const effectiveRating = hoverRating || newRating || rating; // Use hoverRating first, then newRating
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < effectiveRating ? 'star-filled' : 'star-empty'}
        onClick={() => {
          if (!isStatic) {
            setNewRating(i + 1); // Set the rating on click
          }
        }}
        onMouseEnter={() => !isStatic && setHoverRating(i + 1)} // Set hover rating
        onMouseLeave={() => !isStatic && setHoverRating(0)} // Reset hover rating
        style={{ cursor: isStatic ? 'default' : 'pointer' }} // Apply pointer for interactivity
      />
    ));
  };


  return (
    <div className="product-details-container">
      <ToastContainer />
      <div className="product-details">
        <div className="product-image-container">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.title || 'Product Image'}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-rating">
            {renderStars(Math.round(product.rating?.rate || 0), true)}
            <span>({product.rating?.count || 0} reviews)</span>
          </div>
          <p className="product-description">{product.description}</p>
          <h3 className="product-price">${product.price.toFixed(2)}</h3>
          <button className="product-button" onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {/* Existing Reviews */}
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <img src="/placeholder.png" alt="Reviewer" />
            <div className="review-content">
              <h4>{review.reviewer}</h4>
              <div className="star-rating">
                {renderStars(review.rating, true)}
              </div>
              <p>{review.content}</p>
            </div>
          </div>
        ))}

        {/* Add a New Comment */}
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

              {/* Selectable Star Rating */}
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
