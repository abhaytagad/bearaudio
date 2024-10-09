import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { pro_id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${pro_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [pro_id]);

  const addToCart = async (productId) => {
    await axios.post('http://localhost:4000/api/cart/add', { productId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Display all images in a grid */}
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>

        {/* Product details */}
        <div>
          <p className="text-xl font-semibold mb-4">Price: ${product.price}</p>
          {product.discount_price && (
            <p className="text-lg text-red-500 mb-4">Discount Price: ${product.discount_price}</p>
          )}
          <p className="text-gray-700 mb-6">{product.description}</p>

          <button
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            onClick={() => addToCart(product.pro_id)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
