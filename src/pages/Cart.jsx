import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // Function to handle navigation when Start Shopping button is clicked
  const handleStartShopping = () => {
    navigate('/'); // Navigate to the Home page
  };

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      <div className="cart-grid">
        {cart.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-icon">🛒</div> 
            <div className="empty-cart-message">Your cart is empty!</div>
            <button className="empty-cart-button" onClick={handleStartShopping}>
              Start Shopping
            </button>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div className="item-details">
                <h2>{item.title}</h2>
                <p>${item.price}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))
        )}
        {/* Cart summary section */}
        <div className="cart-summary" style={{ gridColumn: '1 / -1' }}>
          <h3>Total Summary</h3>
          <p>Total items: {cart.length}</p>
          <p className="total">Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        {/* Checkout button */}
        {cart.length > 0 && (
          <div className="checkout-container" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
