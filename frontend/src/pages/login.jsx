import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fname, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to process request');
      }
    } catch (error) {
      toast.error(isLogin ? 'Login Error' : 'Registration Error');
    }
    setLoading(false);
  };

  const customMessage = location.state?.message;

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        toast.success('Successfully logged in with Google');
        setUser({ email: result.user.email });
        navigate('/');
      })
      .catch((error) => {
        toast.error('Google Sign-In Error');
      });
  };

  const handleGitHubResponse = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        toast.success('Successfully logged in with GitHub');
        setUser({ email: result.user.email });
        navigate('/');
      })
      .catch((error) => {
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
        <a href="/forgot-password" className="forgot-password">forgot your password?</a>
      )}
      <div className="social-login">
        <p>Sign in with:</p>
        <button className="google-login-button" onClick={handleGoogleSignIn} disabled={loading}>
          <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
        </button>
        <button className="github-login-button" onClick={handleGitHubResponse} disabled={loading}>
          <FontAwesomeIcon icon={faGithub} /> Sign in with GitHub
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
