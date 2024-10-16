import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation for state
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase config
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [fname, setFname] = useState('');        // Adjusted for backend requirement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();  // Destructure setUser from AuthContext
  const navigate = useNavigate();
  const location = useLocation(); // To access state passed from ProductDetails

  // Handle form submission for login/registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = isLogin 
      ? { email, password } 
      : { fname, email, password, cpassword: confirmPassword };

    const url = isLogin ? 'http://localhost:8009/login' : 'http://localhost:8009/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === 201 || data.status === 'success') {
        toast.success(isLogin ? 'Successfully logged in' : 'Successfully registered');
        setUser({ email: payload.email });
        navigate('/');  // Redirect to home after login
      } else {
        toast.error(data.message || 'Failed to process request');
      }
    } catch (error) {
      toast.error(isLogin ? 'Login Error' : 'Registration Error');
    }
    setLoading(false);
  };

  // Extract custom message from location state (if any)
  const customMessage = location.state?.message;

  // Google Sign In
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log('Google Signed In:', result.user);
        toast.success('Successfully logged in with Google');
        setUser({ email: result.user.email });
        navigate('/');  // Redirect after Google login
      })
      .catch((error) => {
        console.error('Google Sign-In Error:', error);
        toast.error('Google Sign-In Error');
      });
  };

  // GitHub Sign In
  const handleGitHubResponse = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log('GitHub Signed In:', result.user);
        toast.success('Successfully logged in with GitHub');
        setUser({ email: result.user.email });
        navigate('/');  // Redirect after GitHub login
      })
      .catch((error) => {
        console.error('GitHub Sign-In Error:', error);
        toast.error('GitHub Sign-In Error');
      });
  };

  return (
    <div className="auth-container">
      {customMessage && <h3 className="custom-message">{customMessage}</h3>}
      {isLogin ? (
        <>
          <h2>Sign in</h2>
          <p>Or <span onClick={() => setIsLogin(false)} className="toggle-link">register for an account</span></p>
        </>
      ) : (
        <>
          <h2>Register</h2>
          <p>Or <span onClick={() => setIsLogin(true)} className="toggle-link">sign in to your account</span></p>
        </>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="fname">Full Name</label>
            <input
              type="text"
              id="fname"
              placeholder="Enter your full name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? (isLogin ? 'Signing in...' : 'Registering...') : (isLogin ? 'Sign in' : 'Register')}
        </button>
      </form>
      {isLogin && (
        <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
      )}
      <div className="social-login">
        <p>Sign in with:</p>
        <button className="google-login-button" onClick={handleGoogleSignIn} disabled={loading}>
          Sign in with Google
        </button>
        <button className="github-login-button" onClick={handleGitHubResponse} disabled={loading}>
          Sign in with GitHub
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
