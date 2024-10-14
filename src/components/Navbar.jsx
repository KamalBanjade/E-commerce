import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to navigate to the cart page
  const goToCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/">ZonKart</Link>
      </div>
      <div className="nav-links">
        <div onClick={goToCart} style={{ position: 'relative', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: '1.5rem' }} /> {/* Adjust size as needed */}
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
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
