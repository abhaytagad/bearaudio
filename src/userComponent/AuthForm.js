import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AuthForm = () => {
  const { loginUser } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFirstName] = useState(''); // Changed name to fname
  const [lname, setLastName] = useState('');
  const [phone, setPhone] = useState(''); // Added phone state
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post('http://localhost:4000/api/user/login', { email, password });
        localStorage.setItem('userToken', response.data.token);
        loginUser(response.data.user);
        navigate('/');
      } else {
        // Handle Registration
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await axios.post('http://localhost:4000/api/user/signup', { fname, lname, email, password, phone });
        localStorage.setItem('userToken', response.data.token);
        loginUser(response.data.user);
        setIsLogin(true)
        
      }
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              value={fname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
        )}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              value={lname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center">
        {isLogin ? 'New user?' : 'Already have an account?'}
        <button onClick={toggleMode} className="text-blue-500 ml-2 underline">
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
