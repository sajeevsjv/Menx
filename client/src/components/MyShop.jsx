import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import SellerNavbar from "./SellerNavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyShop() {
  const [products, setProducts] = useState([]);
  const [lowstockproducts, setLowStockProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // State to manage quantities
  const navigate = useNavigate();

  // Load all products
  useEffect(() => {
    const loadMyProducts = async () => {
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `http://localhost:3003/sellerproducts/${user_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadMyProducts();
  }, []);

  // Load low-stock products
  useEffect(() => {
    const loadLowStockProducts = async () => {
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `http://localhost:3003/lowstockproducts/${user_id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setLowStockProducts(response.data.data);
      } catch (error) {
        console.error("Error loading low-stock products:", error);
      }
    };
    loadLowStockProducts();
  }, []);

  // Increment quantity
  const incrementStock = (productId, currentStock) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || currentStock) + 1,
    }));
  };

  // Decrement quantity
  const decrementStock = (productId, currentStock) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || currentStock) - 1),
    }));
  };

  // Update stock in the backend
  const updateStock = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    const newStock = quantities[productId];

    try {
      const response = await axios.put(
        `http://localhost:3003/updateproduct/${productId}`,
        { stock: newStock },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success(response.data.message);

      // Update local state
      setLowStockProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, stock: newStock } : product
        )
      );

      // Clear quantities
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock.");
    }
  };

  
  return (
    <>
      <UserNavbar />
      <SellerNavbar />
      
      {/* Low Stock Section */}
      <div className="main-grid-container mb-8 pb-10 pt-2 w-full flex flex-col items-center justify-center">
        <div className="newin-text w-11/12 my-4">
          <span className="text-xl text-[red] capitalize tracking-[1px] flex items-center gap-2">
            <ion-icon size="small" name="alert-circle-outline"></ion-icon> Low
            Stock
          </span>
        </div>
        <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-11/12">
          {lowstockproducts?.length > 0 ? (
            lowstockproducts.map((product) => (
              <div className="product-card" key={product._id}>
                {/* Product Image */}
                <div className="product-image">
                  <img
                    src={`http://localhost:3003/${product.product_images[0]}` || "https://via.placeholder.com/150"}
                    alt={product.name || "Product Image"}
                  />
                </div>

                {/* Product Details */}
                <div className="product-details">
                  <h3 className="product-name">
                    {product.name.slice(0, 30) || "Product Name"}..
                  </h3>
                  <p className="product-price font-[arial] font-bold">
                    ₹{product.price || "0.00"}
                  </p>
                  <p className="text-[green] text-lg">
                    Stock: {quantities[product._id] ?? product.stock}
                  </p>
                </div>

                {/* Stock Update Actions */}
                <div className="product-actions flex flex-col gap-2">
                  <div className="quantity-buttons flex justify-center  gap-4 items-center">
                    <span
                      onClick={() =>
                        decrementStock(product._id, product.stock)
                      }
                      className="decrement mt-2  text-black hover:text-orange-500 cursor-pointer  rounded-md"
                    >
                    <ion-icon name="remove-outline"></ion-icon>
                    </span>
                    <span className="quantity-display text-lg font-bold font-mono text-orange-500">
                      {quantities[product._id] ?? product.stock}
                    </span>
                    <span
                      onClick={() =>
                        incrementStock(product._id, product.stock)
                      }
                      className="increment mt-2 text-black hover:text-orange-500 cursor-pointer rounded-md p-0"
                    >
                      <ion-icon name="add-outline"></ion-icon>
                    </span>
                  </div>
                  <button
                    onClick={() => updateStock(product._id)}
                    className="add-to-cart"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h4>Loading products...</h4>
          )}
        </div>
      </div>

      {/* All Products Section */}
      <div className="main-grid-container mb-8 pb-10 pt-2 w-full flex flex-col items-center justify-center">
        <div className="newin-text w-11/12 my-4">
          <span className="text-xl text-gray-800 capitalize tracking-[1px]">
            All products
          </span>
        </div>
        <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-10 gap-x-5 w-11/12">
          {products?.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-image">
                  <img
                    src={`http://localhost:3003/${product.product_images[0]}` || "https://via.placeholder.com/150"}
                    alt={product.name || "Product Image"}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">
                    {product.name.slice(0, 30) || "Product Name"}..
                  </h3>
                  <p className="product-price font-[arial]">
                    ₹{product.price || "0.00"}
                  </p>
                  <p className="text-[green] text-l font-[arial]">
                    Stock: {product.stock}
                  </p>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => navigate(`/editproduct/${product._id}`)}
                    className="add-to-cart flex justify-center gap-1"
                  >
                    <ion-icon name="create-outline"></ion-icon> Edit details /
                    update stock
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h4>Loading products...</h4>
          )}
        </div>
      </div>
    </>
  );
}

export default MyShop;
