import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';


const Auth = () => {
  const { login } = useContext(AdminContext);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        // Signup API Call
        const response = await axios.post('http://localhost:4000/api/admin/signup', { email, password, name });
        login(response.data.token);
      } else {
        // Login API Call
        const response = await axios.post('http://localhost:4000/api/admin/login', { email, password });
        login(response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? 'Admin Signup' : 'Admin Login'}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
