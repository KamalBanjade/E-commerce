import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      {currentUser ? (
        <>
          <h2>Welcome, {currentUser.displayName || currentUser.email}!</h2>
          <button onClick={logout}>Log Out</button>
        </>
      ) : (
        <h2>Please log in.</h2>
      )}
    </div>
  );
};

export default Profile;
