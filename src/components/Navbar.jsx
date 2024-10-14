import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cart } = useCart();

  return (
    <nav>
      <div className="logo">
        <Link to="/">ZonKart</Link> {/* Logo or brand name */}
      </div>
      <div className="nav-links">
        <Link to="/cart">Cart ({cart.length})</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
