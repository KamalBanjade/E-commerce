import React, { useState } from 'react';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // State to switch between login and register

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle form submission (login or register)
    console.log('Submitted:', { email, password });
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
        <p>Google | Facebook | GitHub</p>
      </div>
    </div>
  );
};

export default Login;
