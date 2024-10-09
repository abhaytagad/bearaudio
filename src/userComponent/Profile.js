import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Profile = () => {
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);
  const NaviGate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        console.log(response.data);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        NaviGate('/user/login')
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <img
            src={user.profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-4 border-blue-500"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{user[0].fname+' '+user[0].lname}</h2>
          <p className="text-gray-600">{user[0].email}</p>
          <p className="text-gray-600">{user[0].address}</p>
          <p className="text-gray-500 mt-4">
            Member Since: <span className="font-medium">{new Date(user[0].created_at).toLocaleDateString()}</span>
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
