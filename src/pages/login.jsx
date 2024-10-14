import React, { useState } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';  // Firebase config
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false); // New state to prevent multiple popups
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    console.log('Submitted:', { email, password });
    toast.success('Successfully logged in');
    setTimeout(() => navigate('/'), 2000); // Redirect to Home after 2 seconds
  };

  // Google Sign In
  const handleGoogleSignIn = () => {
    if (isPopupOpen) return; // Prevent multiple popups
    setIsPopupOpen(true);

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google Signed In:', result.user);
        toast.success('Successfully logged in with Google');
        setTimeout(() => navigate('/'), 2000); // Redirect to Home after 2 seconds
      })
      .catch((error) => {
        console.error('Google Sign-In Error:', error);
        toast.error('Google Sign-In Error');
      })
      .finally(() => {
        setIsPopupOpen(false); // Reset popup state
      });
  };

  // GitHub Sign In
  const handleGitHubResponse = () => {
    if (isPopupOpen) return; // Prevent multiple popups
    setIsPopupOpen(true);

    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('GitHub Signed In:', result.user);
        toast.success('Successfully logged in with GitHub');
        setTimeout(() => navigate('/home'), 2000); // Redirect to Home after 2 seconds
      })
      .catch((error) => {
        console.error('GitHub Sign-In Error:', error);
        toast.error('GitHub Sign-In Error');
      })
      .finally(() => {
        setIsPopupOpen(false); // Reset popup state
      });
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <>
          <h2>Sign in</h2>
          <p>
            Or <span onClick={() => setIsLogin(false)} className="toggle-link">register for an account</span>
          </p>
        </>
      ) : (
        <>
          <h2>Register</h2>
          <p>
            Or <span onClick={() => setIsLogin(true)} className="toggle-link">sign in to your account</span>
          </p>
        </>
      )}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="auth-button">
          {isLogin ? 'Sign in' : 'Register'}
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
