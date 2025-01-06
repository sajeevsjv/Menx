import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import Breadcrumb from "./Breadcrumb";
import BlockProductForm from "./BlockProductForm";

const AdminsSingleProduct = () => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBlockFormVisible, setIsBlockFormVisible] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    function fetchData() {
      const authToken = localStorage.getItem("authToken");

      axios({
        url: `http://localhost:3003/getsingleproduct/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => {
          setProductData(response.data.data);
          setSelectedImage(response.data.data.product_images[0]);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load product data.");
          setLoading(false);
        });
    }
    fetchData();
  }, [id]);

  const handleBlockButtonClick = () => {
    setIsBlockFormVisible(true);
  };

  const handleCloseBlockForm = () => {
    setIsBlockFormVisible(false);
  };

  return (
    <>
      <AdminNav />
      {loading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="product-pg-container mt-28 pt-3 w-full flex px-4">
          {/* Image Section */}
          <div className="product-img-section flex flex-col items-start w-[30%] md:w-[10%]">
            {productData.product_images &&
              productData.product_images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3003/${image}`}
                  alt={`Product Image ${index + 1}`}
                  className={`mb-2 cursor-pointer border ${
                    selectedImage === image ? "border-black" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col gap-5 sm:flex-row mx-auto p-4">
            {/* Display the selected image */}
            <div className="mb-4">
              <img
                src={`http://localhost:3003/${selectedImage}`}
                alt="Selected Product"
                className="w-full"
              />
            </div>

            <div className="product-details xs:w-[100%] lg:w-[45%]">
              <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
              <p className="text-gray-500 text-sm mb-2">
                Seller: {productData.seller}
              </p>
              <div className="flex gap-2">
                <h4 className="line-through pl-1 text-gray-500">
                  ₹{productData.mrp}
                </h4>
                <h2 className="text-xl font-semibold mb-4 font-mono text-orange-500">
                  ₹{productData.price}
                </h2>
              </div>
              <button
                className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
                onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
              >
                Description {isDescriptionVisible ? "-" : "+"}
              </button>
              {isDescriptionVisible && (
                <p className="text-gray-700 mt-2">
                  {productData.description}
                </p>
              )}
              <div className="my-6">
                <label className="block font-semibold mb-2">
                  STOCK : {productData.stock}
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleBlockButtonClick}
                  className="flex text-lg items-center flex-1 justify-center gap-1 transition-all hover:-translate-y-[1px] duration-300 bg-black hover:text-orange-500 text-white py-2 text-center rounded"
                >
                  Block Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBlockFormVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <BlockProductForm productId={id} onClose={handleCloseBlockForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminsSingleProduct;
