import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { productId } = useParams(); // Get productId from the URL
  const { register, handleSubmit, setValue } = useForm();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // State to store categories
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Fetch product details and available categories on component mount
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        // Fetch all categories
        const categoryResponse = await axios.get('http://localhost:4000/api/all/categories');
        setCategories(categoryResponse.data.categories); // Save categories

        // Fetch product details
        const productResponse = await axios.get(`http://localhost:4000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const productData = productResponse.data;
        setProduct(productData);

        // Pre-fill form with product data
        setValue('name', productData.name);
        setValue('brand', productData.brand);
        setValue('price', productData.price);
        setValue('category', productData.category);
        setValue('colors', productData.colors);
        setValue('description', productData.description);
      } catch (error) {
        console.error('Error fetching product or categories:', error.response?.data);
      }
    };

    fetchProductAndCategories();
  }, [productId, setValue, token]);

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
    setValue('images', acceptedFiles);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('price', data.price);
    formData.append('category', data.category); // Append selected category
    formData.append('colors', data.colors);
    formData.append('description', data.description);

    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setUploading(true);
      await axios.put(`http://localhost:4000/api/admin/products/edit/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin/products'); // Navigate back to the product list
    } catch (error) {
      console.error('Error updating product:', error.response?.data);
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {product ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('name', { required: true })}
            />
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              id="brand"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('brand', { required: true })}
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              id="price"
              type="number"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('price', { required: true })}
            />
          </div>

          {/* Category - Dropdown */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('category', { required: true })}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.cat_id} value={category.cat_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div className="mb-4">
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
            <input
              id="colors"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('colors')}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              {...register('description')}
            ></textarea>
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-gray-500">Drag 'n' drop new images here, or click to select files</p>
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((file, index) => (
                  <div key={index}>
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
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            disabled={uploading}
          >
            {uploading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default EditProduct;
