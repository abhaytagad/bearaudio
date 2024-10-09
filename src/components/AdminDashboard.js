import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const navigate = useNavigate();
 
  // Check if the admin is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }

    // Fetch dashboard metrics (optional)
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.data);
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      }
    };

    fetchMetrics();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl text-indigo-600 mt-2">{metrics.totalProducts || 'Loading...'}</p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl text-indigo-600 mt-2">{metrics.totalOrders || 'Loading...'}</p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl text-indigo-600 mt-2">{metrics.totalUsers || 'Loading...'}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Manage Orders
        </button>

        <button
          onClick={() => navigate('/admin/users')}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/managepayment')}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Manage Payments
        </button>
        <button
          onClick={() => navigate('/admin/addcategory')}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
        >
          Manage Category
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
