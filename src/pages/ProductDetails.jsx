import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api'; // Ensure this is your Shopify API fetch
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        toast.error('Failed to load product data.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    addToCart(product);
    toast.success(`${product.title} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="product-details-container">
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
              <FaStar key={i} className={i < Math.round(product.rating?.rate || 0) ? 'star-filled' : 'star-empty'} />
            ))}
            <span>({product.rating?.count || 0} reviews)</span>
          </div>
          <p className="product-description">{product.description}</p>
          <h3 className="product-price">${product.price.toFixed(2)}</h3>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {/* This section can be dynamically populated with actual reviews from the API */}
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

      {/* Toast container must be included once in your component tree */}
      <ToastContainer />
    </div>
  );
}

export default ProductDetails;
