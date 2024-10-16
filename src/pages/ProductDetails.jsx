import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { currentUser } = useAuth(); // Destructure currentUser from AuthContext
  const navigate = useNavigate(); // Initialize navigate

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
    // Check if the user is logged in
    if (!currentUser) {
      // Redirect to login page with a custom message
      navigate('/login', { state: { message: 'Please login in order to add products to the cart.' } });
      toast.warn('Please login to add items to your cart');
    } else {
      addToCart(product);
      toast.success('Product added to cart');

      // Optionally navigate to home after adding to cart
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="product-details-container">
      <ToastContainer /> {/* This ensures toasts are displayed */}
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
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(product.rating?.rate || 0) ? 'star-filled' : 'star-empty'}
              />
            ))}
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
        <div className="review-item">
          <img src="/placeholder.png" alt="Reviewer" />
          <div className="review-content">
            <h4>John Doe</h4>
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="star-filled" />
              ))}
            </div>
            <p>This product is amazing! Highly recommended.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
