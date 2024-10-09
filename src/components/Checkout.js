import axios from 'axios';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const { cartItems, totalPrice } = location.state;

  // State to manage selected payment option
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      if (paymentMethod === 'COD') {
        // Place order for Cash on Delivery
        await axios.post('http://localhost:4000/api/user/order', {
          cartItems,
          totalPrice,
          paymentMethod: 'Cash on Delivery',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        console.log('Order placed successfully!');
        setOrderPlaced(true);
      } else if (paymentMethod === 'Online Payment') {
        // Integrate with payment gateway (e.g., Stripe, Razorpay, etc.)
        // Redirect to payment gateway or handle payment
        console.log('Redirecting to payment gateway...');
        // After successful payment, place the order
        await axios.post('http://localhost:4000/api/user/order', {
          cartItems,
          totalPrice,
          paymentMethod: 'Online Payment',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        console.log('Payment successful and order placed!');
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Checkout</h1>

      <div>
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <div key={item.pro_id} className="border p-4 rounded-lg">
              <h3 className="text-lg">{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Discount: ${item.discount_price}</p>
            </div>
          ))}
        </div>
        <h2 className="text-lg mt-4">Total Price: ${totalPrice}</h2>

        {/* Payment Method Selection */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">Select Payment Method</h2>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                className="mr-2"
              />
              Cash on Delivery (COD)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Online Payment"
                checked={paymentMethod === 'Online Payment'}
                onChange={() => setPaymentMethod('Online Payment')}
                className="mr-2"
              />
              Online Payment
            </label>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          onClick={handlePlaceOrder}
        >
          {paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
        </button>

        {orderPlaced && <p className="text-green-500 mt-4">Order placed successfully!</p>}
      </div>
    </div>
  );
};

export default Checkout;
