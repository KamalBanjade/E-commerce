import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/layout';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/login';  // Ensure 'Login' is capitalized
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import GoogleOAuthProvider
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './components/profile';  // Ensure correct import for Profile
import { AuthProvider } from './context/AuthContext';  // Import the Auth context for managing user state
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure toastify CSS is imported

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;  // Access Google OAuth client ID from environment variable

  return (
    <GoogleOAuthProvider clientId={clientId}>  {/* Wrap the app with GoogleOAuthProvider for Google login */}
      <AuthProvider>  {/* Wrap with AuthProvider to manage user authentication */}
        <CartProvider>  {/* Wrap with CartProvider to manage cart state */}
          <Router>
            <Navbar />  {/* Navbar stays the same across all pages */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />  {/* Login route */}
                <Route path="/forgot-password" element={<ForgotPassword />} />  {/* Forgot password route */}
                <Route path="/forgotpassword/:id/:token" element={<ResetPassword />} />  {/* Reset password route */}
                <Route path="/profile" element={<Profile />} />  {/* Profile page route */}
              </Routes>
            </div>
            <ToastContainer />  {/* Move ToastContainer outside of Routes to make it global */}
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
