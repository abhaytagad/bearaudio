import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Create the Admin context
export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // Check if the admin is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdmin({ token });
    }
  }, []);

  // Handle login and save token
  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setAdmin({ token });
    navigate('/admin/dashboard');
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    navigate('/admin/login');
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
