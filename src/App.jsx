import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/layout';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/login'; 
import './App.css';
function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar /> {/* This stays the same on all pages */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}


export default App;
