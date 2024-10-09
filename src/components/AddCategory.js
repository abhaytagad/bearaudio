import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);  // Use file instead of URL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', imageFile);  // Append file to form data

      const response = await axios.post('http://localhost:4000/api/admin/add-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,  // Authorization if required
        },
      });

      setMessage(response.data.message);
      setName('');
      setDescription('');
      setImageFile(null);  // Reset file input
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding category');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);  // Extract the file from the input
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Category Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input
            type="file"
            className="w-full px-3 py-2 border rounded"
            onChange={handleImageChange}  // Handle file change
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
