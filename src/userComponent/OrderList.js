import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });

        const { orders, products } = response.data;
        setOrders(orders);
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const relatedProducts = products.filter(
              (product) => product.pro_id === order.pro_id
            );

            return (
              <div key={order.order_id} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">Order #{order.order_id}</h3>
                <p className="text-gray-500">Ordered on: {new Date(order.place_on).toLocaleDateString()}</p>
                <p className={`font-bold ${order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>
                  Status: {order.status}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold">Items:</h4>
                  <ul className="list-disc ml-4">
                    {relatedProducts.length > 0 ? (
                     (
                        <div>
                            <img src={relatedProducts[0].images[0]} className='w-32' />
                            <li key={relatedProducts[0].pro_id}>
                          {relatedProducts[0].name} (Quantity: {order.quantity})
                        </li>
                        </div>
                        )
                    ) : (
                      <li>No items available or out of stock</li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderList;
