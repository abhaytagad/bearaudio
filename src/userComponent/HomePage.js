import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(0); 
  const [categories, setCategories] = useState([]); 
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Track user login status
  const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productResponse = await axios.get('http://localhost:4000/api/all/products');
        setProducts(productResponse.data.products);
        console.log(productResponse.data);

        const categoryResponse = await axios.get('http://localhost:4000/api/all/categories');
        setCategories([ ...categoryResponse.data.categories]);
        console.log(categoryResponse.data.categories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products or categories:', error);
        setLoading(false);
      }
    };

    fetchProductsAndCategories();

    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 0 || product.category_id === parseInt(categoryFilter)) 
    );
  });

  const addToCart = async (productId) => {
    const response = await axios.post('http://localhost:4000/api/cart/add',{productId}, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    
    setCartItems(cartItems + 1); 
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="p-4">
      {/* Header with Login and Cart */}
      <div className="flex justify-between px-4 mb-4">
          {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
      </div>
      {/* Login Dropdown */}
      <div className="relative">
          {isUserLoggedIn ? (
            <div>
              <button onMouseOverCapture={handleDropdown} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                My Account
              </button>
              {showDropdown && (
                <div className="absolute right-0 bg-white border shadow-md rounded-md mt-2 w-40">
                  <ul>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/user/login')}>
                      Login
                    </li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/user/profile')}>
                      My Profile
                    </li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/user/orders')}>
                      Orders
                    </li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/wishlist')}>
                      Wishlist
                    </li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/rewards')}>
                      Rewards
                    </li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/gift-cards')}>
                      Gift Cards
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Login
            </button>
          )}
        </div>
        {/* Cart */}
        <button onClick={() => navigate('/user/cart')} className="relative">
         <FontAwesomeIcon icon={faShoppingCart} />
          {cartItems > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {cartItems}
            </span>
          )}
        </button>
      </div>

   
      

      {/* Category filter */}
          <div className="mb-4">
      <label className="block mb-2">Filter by Category:</label>
      <div className="p-2 flex gap-2 items-center rounded-md w-full">
        {categories.map((category) => (
          <div
            key={category.cat_id}
            onClick={() => setCategoryFilter(category.cat_id)} // Pass the category ID directly
            className="flex rounded-md border border-gray-300 flex-col justify-center items-center cursor-pointer"
          >
            <img
              src={category.image_url}
              alt={category.name} // Improved alt text for better accessibility
              className="h-40 object-contain mb-2"
            />
            <h2>{category.name}</h2>
          </div>
        ))}
      </div>
    </div>


      {/* Loading indicator */}
      {loading && <div className="text-center">Loading products...</div>}

      {/* Render products by category */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.pro_id} className="border p-4 rounded-lg shadow-md">
              <img
                src={product.images[0]} 
                alt={product.name} 
                className="h-40 object-contain mb-2 cursor-pointer"
                onClick={() => navigate(`/product/${product.pro_id}`)}  
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">${product.price}</p>
              <button
                onClick={() => addToCart(product.pro_id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-2"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
