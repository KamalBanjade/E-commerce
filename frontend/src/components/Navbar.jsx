import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import logo from '/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCategories } from '../services/api';

function Navbar({ onCategorySelect }) {
  const { cart, clearCart } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false); // Manage categories dropdown state
  const [categories, setCategories] = useState([]); // State to store categories

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  // Function to toggle category dropdown
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category); // Trigger the function passed as a prop to filter products
    setCategoriesOpen(false); // Close the dropdown after selection
  };

  return (
    <nav>
      {/* Logo and Cart */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="ZonKart" className="logo-img" />
        </Link>
      </div>
      <div className="nav-links">
        {/* Categories Dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={toggleCategories} className="category-button">
            Categories
          </button>
          {categoriesOpen && (
            <div className="category-dropdown">
              {categories.map((category) => (
                <div
                  key={category}
                  className="category-item"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="cart-icon-container">
          <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>

        {/* Login or User Dropdown */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              {currentUser.email[0].toUpperCase()}
            </div>
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  padding: '10px',
                  zIndex: '1000',
                }}
              >
                <p style={{ margin: 0 }}>{currentUser.email}</p>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">LogIn</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
