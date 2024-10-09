import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner'; // Install react-loader-spinner for the spinner

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUser = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/users/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError('Error updating user. Please try again.');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError('Error deleting user. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
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
              <th className="py-2 px-4 text-left">User ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{user.user_id}</td>
                <td className="py-2 px-4">{user.fname + ' ' + user.lname}</td>
                <td className="py-2 px-4">{user.email}</td>
                
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white rounded px-2 py-1"
                    onClick={() => deleteUser(user.id)}
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

export default ManageUsers;
