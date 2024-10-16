import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth context
import { useState } from 'react';
import logo from '../assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Navbar() {
  const { cart, clearCart } = useCart(); // Destructure clearCart from CartContext
  const { currentUser, logout } = useAuth(); // Destructure currentUser and logout from AuthContext
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown state

  // Function to navigate to the cart page
  const goToCart = () => {
    navigate('/cart');
  };

  // Function to get initials from email
  const getInitials = (email) => {
    if (!email) return '';
    const parts = email.split('@')[0].split('.'); // Extract initials from email
    return parts.map(part => part[0].toUpperCase()).join('');
  };

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    clearCart(); // Clear the cart when logging out
    logout(); // Call the logout function
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <nav>
   <div className="logo">
      <Link to="/" className="logo-link">
        <img src={logo} alt="ZonKart" className="logo-img" />
      </Link>
    </div>
      <div className="nav-links">
        <div onClick={goToCart} style={{ position: 'relative', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faCartShopping} className="cart-icon" />
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#e74c3c',
              color: '#ecf0f1',
              borderRadius: '50%',
              padding: '4px 8px',
              fontSize: '0.4em'
            }}>
              {cart.length}
            </span>
          )}
        </div>
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            {/* Initials displayed in a circle */}
            <div
              onClick={toggleDropdown}
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
              {getInitials(currentUser.email)}
            </div>

            {/* Dropdown menu */}
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
                <p style={{ margin: 0 }}>{currentUser.email}</p> {/* Show user's email */}
                <button
                  onClick={handleLogout} // Call handleLogout on button click
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
