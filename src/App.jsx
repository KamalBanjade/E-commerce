import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/layout';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/login';  // Make sure 'Login' is capitalized to match the file import
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider

function App() {
  const clientId = '752461170853-faqj9ibikbohaii6g9u2a7ouossrd01e.apps.googleusercontent.com';  // Your Google client ID

  return (
    <GoogleOAuthProvider clientId={clientId}>  {/* Wrap the app with GoogleOAuthProvider */}
      <CartProvider>
        <Router>
          <Navbar /> {/* This stays the same on all pages */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />  {/* Login route */}
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
