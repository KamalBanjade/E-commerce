// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Firebase configuration
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Create the AuthContext
const AuthContext = createContext();

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);  // State for storing the current user
  const [loading, setLoading] = useState(true);

  // Monitor authentication state (Firebase Auth Listener)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the user in state
      setLoading(false); // Loading state completed
    });

    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  // Sign out method
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);  // Set currentUser to null after logout
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    currentUser,    // The logged-in user
    setUser: setCurrentUser,  // Add the setUser function
    logout,         // Logout function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when loading is done */}
    </AuthContext.Provider>
  );
};
