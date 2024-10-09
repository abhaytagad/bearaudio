import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router';

const AddProduct = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const Navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/all/categories');
        setCategories(response.data.categories);
        console.log(response); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);    

  // Handle image uploads and form submission
  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
    setValue('images', acceptedFiles);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('price', data.price);
    formData.append('category', data.category); // Category selected from dropdown
    formData.append('colors', data.colors);
    formData.append('description', data.description);
    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setUploading(true);
      const response = await axios.post('http://localhost:4000/api/admin/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      Navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error.response?.data);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'image/*',
  });

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('name', { required: true })}
          />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            id="brand"
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('brand', { required: true })}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('price', { required: true })}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('category', { required: true })}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.cat_id} value={category.cat_id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
          <input
            id="colors"
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('colors')}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            {...register('description')}
          ></textarea>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
          >
            <input {...getInputProps()} />
            <p className="text-gray-500">Drag 'n' drop images here, or click to select files</p>
          </div>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((file, index) => (
                <div key={index} className="shadow-lg p-2 rounded-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
