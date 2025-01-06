import React, { useState, useEffect } from 'react';
import BlockProductForm from './BlockProductForm';
import UnblockProductForm from './UnblockProduct';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlockedProducts = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isBlockFormVisible, setIsBlockFormVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isUnblockFormVisible, setIsUnblockFormVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const authToken = localStorage.getItem('authToken');
      const user_id = localStorage.getItem('user_id');
      try {
        const response = await axios.get(
          `http://localhost:3003/getallproducts/${user_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const blockedProducts = response.data.data.filter(
          (product) => product.isBlocked
        );
        setFilteredProducts(blockedProducts);
      } catch (error) {
        console.error('Error fetching products:', error.response || error);
      }
    };
    loadProducts();
  }, []);

  const updateBlockStatus = () => {
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== currentProductId)
    );
    setIsBlockFormVisible(false);
    setIsUnblockFormVisible(false);
  };

  const handleBlockButtonClick = (e, productId) => {
    e.stopPropagation();
    setCurrentProductId(productId);
    setIsBlockFormVisible(true);
  };

  const handleUnblockButtonClick = (e, productId) => {
    e.stopPropagation();
    setCurrentProductId(productId);
    setIsUnblockFormVisible(true);
  };

  return (
    <>
      <div className="newin-section mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-11/12 mx-auto">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition"
            onClick={() => navigate(`/productpage/${product._id}`)}
          >
            <div className="product-image">
              {product.product_images?.length > 0 ? (
                <img
                  src={`http://localhost:3003/${product.product_images[0]}`}
                  alt={product.name}
                  className="object-cover w-full h-48 rounded-md"
                />
              ) : (
                <img
                  src="/images/placeholder.png"
                  alt="Placeholder"
                  className="object-cover w-full h-48 rounded-md"
                />
              )}
            </div>
            <div className="product-details mt-3">
              <h3 className="product-name text-lg font-medium">
                {product.name.slice(0, 35)}...
              </h3>
              <p className="line-through text-sm text-gray-400">
                ₹{product.mrp}
              </p>
              <p className="font-mono text-orange-500">₹{product.price}</p>
            </div>
            <div className="product-actions mt-3 flex justify-between items-center">
              <button className="font-mono border px-3 py-1 rounded-md">
                Stock: {product.stock}
              </button>
              {product.isBlocked ? (
                <button
                  onClick={(e) => handleUnblockButtonClick(e, product._id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-md"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={(e) => handleBlockButtonClick(e, product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Block
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="no-data w-full flex flex-col items-center mt-10">
            <img
              src="/images/9170826.jpg"
              alt="No Data"
              className="w-1/2"
            />
            <h3 className="text-gray-500 mt-4">
              No products found for the current filter.
            </h3>
          </div>
        )}
      </div>

      {isBlockFormVisible && currentProductId && (
        <BlockProductForm
          productId={currentProductId}
          onClose={() => setIsBlockFormVisible(false)}
          onBlockSuccess={updateBlockStatus}
        />
      )}

      {isUnblockFormVisible && currentProductId && (
        <UnblockProductForm
          productId={currentProductId}
          onClose={() => setIsUnblockFormVisible(false)}
          onUnblockSuccess={updateBlockStatus}
        />
      )}
    </>
  );
};

export default BlockedProducts;