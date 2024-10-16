import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8009/sendpasswordlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.status === 201) {
        toast.success('Password reset link sent to your email');
      } else {
        toast.error(data.message || 'Error sending reset link');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending reset link');
    }

    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
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
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send Password Reset Link'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
