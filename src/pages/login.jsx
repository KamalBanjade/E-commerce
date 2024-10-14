import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate in v6
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const API_URL = 'https://your-api-url.com'; // Replace with your actual API URL

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send login details
      });

      if (!response.ok) {
        throw new Error('Login failed! Please check your credentials.'); // Handle login failure
      }

      const data = await response.json();
      // Store the authentication token or user info in localStorage
      localStorage.setItem('token', data.token);

      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Redirect to home or any other page after successful login
      navigate('/'); // Redirect after login
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
