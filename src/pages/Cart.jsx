import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to handle navigation when Start Shopping button is clicked
  const handleStartShopping = () => {
    navigate('/');
  };

  // Function to handle removing one unit of an item
  const handleRemoveOne = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.id, item.quantity - 1); // Decrease quantity by 1
    } else {
      removeFromCart(item.id); // Remove item if quantity is 1
    }
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
                <h2>{item.title} *{item.quantity}</h2>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemoveOne(item)}>Remove</button>
              </div>
            </div>
          ))
        )}
        <div className="cart-summary" style={{ gridColumn: '1 / -1' }}>
          <h3>Total Summary</h3>
          <p>Total items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
          <p className="total">Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
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
