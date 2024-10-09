import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (token) {
          const response = await axios.get('http://localhost:4000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
