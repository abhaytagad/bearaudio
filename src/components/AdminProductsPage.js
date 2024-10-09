import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.products);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Navigate to add product page
  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  // Navigate to edit product page
  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  }; 

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(product => product.pro_id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };   

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Add Product Button */}
      <button
        onClick={handleAddProduct}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Add Product
      </button>

      {/* Products Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-4 border-b">Product Name</th>
                <th className="px-6 py-4 border-b">Category</th>
                <th className="px-6 py-4 border-b">Brand</th>
                <th className="px-6 py-4 border-b">Price</th>
                <th className="px-6 py-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.pro_id}>
                  <td className="px-6 py-4 border-b">{product.name}</td>
                  <td className="px-6 py-4 border-b">{product.category}</td>
                  <td className="px-6 py-4 border-b">{product.brand}</td>
                  <td className="px-6 py-4 border-b">${product.price}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEditProduct(product.pro_id)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.pro_id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
