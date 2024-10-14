import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart } = useCart();

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      <div className="cart-grid">
        {cart.length === 0 ? (
          <div className="cart-item empty-cart-message" style={{ gridColumn: '1 / -1', minHeight: 'auto', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Your cart is empty.</p>
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
