import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/admin/payments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setPayments(response.data);
      } catch (err) {
        setError('Error fetching payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Handle payment deletion
  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setPayments(payments.filter(payment => payment.pay_id !== paymentId));
    } catch (err) {
      setError('Error deleting payment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Payments</h2>
      {loading ? (
        <p>Loading payments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Payment ID</th>
              <th className="py-2 px-4 text-left">User ID</th>
              <th className="py-2 px-4 text-left">Product ID</th>
              <th className="py-2 px-4 text-left">Transaction Details</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.pay_id} className="border-b">
                <td className="py-2 px-4">{payment.pay_id}</td>
                <td className="py-2 px-4">{payment.user_id}</td>
                <td className="py-2 px-4">{payment.pro_id}</td>
                <td className="py-2 px-4">{payment.tran_details}</td>
                <td className="py-2 px-4">{payment.date}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => deletePayment(payment.pay_id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
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

export default ManagePayments;
