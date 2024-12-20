import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image
  const [cartItems, setCartItems] = useState([]);
  

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };
  

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
          setSelectedImage(response.data.data.product_images[0]); // Set the first image as default
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to load product data.");
          setLoading(false);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      console.log("loadcart executed")
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        let response = await axios({
          method: "GET",
          url: `http://localhost:3003/getsingleuser/${user_id}`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })

        console.log("response from 2nd useefect :", response);
        let data = response.data.data;
        console.log("response data :", data);
        let cartWithQuantities = data.cart.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        setCartItems(cartWithQuantities);
      }
      catch (error) {
        if (error.response) {
          console.log("eror response :", error.response);
        }
        console.log("error :", error);
      }
    };

    loadCart();
  }, [])

  return (
    <>
      <UserNavbar />
      {loading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="product-pg-container mt-20 pt-3 w-full flex ">
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
                  onClick={() => setSelectedImage(image)} // Update the selected image on click
                />
              ))}
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col justify-evenly sm:flex-row mx-auto p-4">
            {/* Display the selected image */}
            <div className="mb-4">
              <img
                src={`http://localhost:3003/${selectedImage}`}
                alt="Selected Product"
                className="w-full"
              />
            </div>
            
            <div className="product-details w-[45%]">
            <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
            <p className="text-gray-500 text-sm mb-2">Seller: {productData.seller}</p>
            <h2 className="text-xl font-semibold mb-4">${productData.price}</h2>
            <button
              className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
              onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
            >
              Description {isDescriptionVisible ? "-" : "+"}
            </button>
            {isDescriptionVisible && (
              <p className="text-gray-700 mt-2">{productData.description}</p>
            )}
            <div className="my-6">
              <label className="block font-semibold mb-2">QUANTITY</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  className="bg-gray-200 hover:bg-gray-300 text-lg px-3 py-1 rounded"
                >
                  -
                </button>
                <span className="text-lg font-bold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="bg-gray-200 hover:bg-gray-300 text-lg px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              {cartItems.includes(productData._id) ? 
               <button className="flex-1 bg-black text-white py-2 text-center rounded hover:bg-gray-800">
               Add to Cart
             </button>
              :
              <button className="flex-1 bg-black text-white py-2 text-center rounded hover:bg-gray-800">
                Added to Cart
              </button>
              }
              <button className="flex-1 border border-black py-2 text-center rounded hover:bg-gray-100">
                Buy Now
              </button>
            </div>
            <CollapsibleSection title="PRODUCT INFO">
              <p className="text-gray-700">
                Detailed product info goes here, including sizing and care.
              </p>
            </CollapsibleSection>
            <CollapsibleSection title="RETURN & REFUND POLICY">
              <p className="text-gray-700">Details about the return policy go here.</p>
            </CollapsibleSection>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4">
      <button
        className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title} {isOpen ? "-" : "+"}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default ProductPage;
