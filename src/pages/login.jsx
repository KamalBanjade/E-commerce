import React, { useState } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase config
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [fname, setFname] = useState('');        // Adjusted for backend requirement
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Prevent multiple popups
  const navigate = useNavigate();

  // Handle form submission for login/registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords if registering
    if (!isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    const payload = isLogin 
      ? { email, password } 
      : { fname, email, password, cpassword: confirmPassword }; // Backend expects `fname` and `cpassword`

    const url = isLogin ? 'http://localhost:8009/login' : 'http://localhost:8009/register';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), 
      });

      const data = await response.json();
      console.log(isLogin ? 'Login Response:' : 'Registration Response:', data); 

      if (data.status === 201 || data.status === 'success') {
        toast.success(isLogin ? 'Successfully logged in' : 'Successfully registered');
        setTimeout(() => navigate('/'), 1300);  // Redirect to home after success
      } else {
        toast.error(data.message || 'Failed to process request');
      }
    } catch (error) {
      console.error(isLogin ? 'Login Error:' : 'Registration Error:', error);
      toast.error(isLogin ? 'Login Error' : 'Registration Error');
    }
    
    setLoading(false);
  };

  // Google Sign In (already implemented)
  const handleGoogleSignIn = () => {
    if (isPopupOpen) return; // Prevent multiple popups
    setIsPopupOpen(true);

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log('Google Signed In:', result.user);
        toast.success('Successfully logged in with Google');
        setTimeout(() => navigate('/'), 2000);  // Redirect after Google login
      })
      .catch((error) => {
        console.error('Google Sign-In Error:', error);
        toast.error('Google Sign-In Error');
      })
      .finally(() => setIsPopupOpen(false));
  };

  // GitHub Sign In (already implemented)
  const handleGitHubResponse = () => {
    if (isPopupOpen) return;
    setIsPopupOpen(true);

    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log('GitHub Signed In:', result.user);
        toast.success('Successfully logged in with GitHub');
        setTimeout(() => navigate('/'), 2000);  // Redirect after GitHub login
      })
      .catch((error) => {
        console.error('GitHub Sign-In Error:', error);
        toast.error('GitHub Sign-In Error');
      })
      .finally(() => setIsPopupOpen(false));
  };

  return (
    <div className="auth-container">
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

        <div className="google-login-container">
          <button className="google-login-button" onClick={handleGoogleSignIn} disabled={isPopupOpen}>
            Sign in with Google
          </button>
        </div>

        <div className="github-login-container">
          <button className="github-login-button" onClick={handleGitHubResponse} disabled={isPopupOpen}>
            Sign in with GitHub
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
