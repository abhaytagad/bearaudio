import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setCartItems(response.data.cartItems);
        calculateTotal(response.data.cartItems);
        console.log(response.data.cartItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price - item.discount_price, 0);
    setTotalPrice(total);
  };

  const handleRemove = async (pro_id) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/remove/${pro_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      setCartItems(cartItems.filter(item => item.pro_id !== pro_id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    // Navigate to the Checkout page and pass the cartItems and totalPrice
    navigate('/checkout', { state: { cartItems, totalPrice } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Shopping Cart</h1>

      {loading && <p>Loading...</p>}

      {!loading && cartItems.length === 0 && <p>Your cart is empty.</p>}

      {!loading && cartItems.length > 0 && (
        <div>
          {cartItems.map(item => (
            <div key={item.pro_id} className="border-b py-4 flex flex-col items-center">
              <h3 className="text-lg">{item.name}</h3>
              <img src={item.images[0]} alt="" className="h-40 object-contain mb-2 cursor-pointer" />
              <p>Price: ${item.price}</p>
              <p>Discount: ${item.discount_price}</p>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleRemove(item.pro_id)}
              >
                Remove
              </button>
            </div>
          ))}
          <h2 className="text-xl mt-4">Total: ${totalPrice}</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
