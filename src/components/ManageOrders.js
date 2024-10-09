import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Install react-loader-spinner for the spinner

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError('Error updating order status. Please try again.');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      setError('Error deleting order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <TailSpin color="#4A90E2" height={50} width={50} />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              {/* <th className="py-2 px-4 text-left">Total Price</th> */}
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{order.order_id}</td>
                <td className="py-2 px-4">{order.user_id}</td>
                {/* <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td> */}
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : order.status === 'Shipped'
                        ? 'bg-blue-500 text-white'
                        : order.status === 'Delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4 flex space-x-2">
                  <select
                    className="border border-gray-300 rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    className="bg-red-500 text-white rounded px-2 py-1"
                    onClick={() => deleteOrder(order.order_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
