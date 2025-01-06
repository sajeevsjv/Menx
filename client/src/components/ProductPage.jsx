import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image
  const [cartItems, setCartItems] = useState([]);
  const [isAddressSelectingFormVisible, setIsAddressSelectingFormVisible] = useState(false);
  const [address, setAddress] = useState();
  
  


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

  console.log("productData :", productData);

  const placeOrder = async () => {
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    const processingToast = toast.loading("Processing your order...");
    const productsInfo = [{ ...productData, quantity }];
    const isFromCart = false;

    try {
      const response = await axios.post(
        `http://localhost:3003/placeorder/${user_id}`,
        { productsInfo, totalAmount: productData.price * quantity, isFromCart },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.update(processingToast, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/shop"), 2000);
    } catch (error) {
      console.log("error :", error);
      toast.update(processingToast, {
        render: error.response?.data.message || "An unexpected error occurred.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

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
  }, []);

  const addToCart = async (id) => {
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");

    if (!user_id || !authToken) {
      toast.error("Please login to continue.");
      setIsAddingToCart(false);
      return;
    }

    try {
      // Update the cart UI optimistically
      setCartItems((prevCartItems) => {
        // Check if the product already exists in the cart
        const existingItemIndex = prevCartItems.findIndex((item) => item._id === id);
        if (existingItemIndex >= 0) {
          // Update quantity for the existing item
          const updatedCart = [...prevCartItems];
          updatedCart[existingItemIndex].quantity = quantity;
          return updatedCart;
        }
        // Add a new item to the cart
        return [...prevCartItems, { _id: id, quantity }];
      });

      const response = await axios.post(
        "http://localhost:3003/addtocart",
        { user_id, product_id: id, quantity },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
    } catch (error) {
      // Revert optimistic UI update on error
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item._id !== id)
      );
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const updateCart = async (id) => {
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");

    if (!user_id || !authToken) {
      toast.error("Please login to continue.");
      setIsAddingToCart(false);
      return;
    }

    try {
      // Update the cart UI optimistically
      setCartItems((prevCartItems) => {
        // Check if the product already exists in the cart
        const existingItemIndex = prevCartItems.findIndex((item) => item._id === id);
        if (existingItemIndex >= 0) {
          // Update quantity for the existing item
          const updatedCart = [...prevCartItems];
          updatedCart[existingItemIndex].quantity = quantity;
          return updatedCart;
        }
        // Add a new item to the cart
        return [...prevCartItems, { _id: id, quantity }];
      });

      const response = await axios.patch(
        "http://localhost:3003/updatecart",
        { user_id, product_id: id, quantity },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
    } catch (error) {
      // Revert optimistic UI update on error
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item._id !== id)
      );
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    }
  };


  console.log("cartitems :", cartItems);
  console.log("productid :", productData?._id);

  return (
    <>
      <UserNavbar />
      {/* adress selecting box after clicking proceed */}
      {isAddressSelectingFormVisible && (
        <div
          onClick={() => setIsAddressSelectingFormVisible(false)}
          className="fixed w-full h-[100vh] top-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg border border-gray-200 animate-scaleIn transition-transform duration-300 ease-out zoom-in-animation"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-4 lowercase">
              Select an address to deliver your product.
            </h2>
            <div className="space-y-4">
              {address?.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm border hover:bg-gray-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="address"
                    checked="true" // Fix for correct radio button selection
                    value={data.address}
                    id={`address-${index}`}
                    className="w-5 h-5 text-blue-600"
                  />
                  <label
                    htmlFor={`address-${index}`}
                    className="ml-3 text-gray-600 font-medium"
                  >
                    {data.address}, {data.city}, {data.state}, {data.country} -{" "}
                    {data.pincode}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={placeOrder}
              className="mt-6 w-full px-6 py-3 bg-orange-400 transition-all text-white hover:-translate-y-1 duration-200 rounded-lg hover:bg-black"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <div className="product-pg-container mt-20 pt-3 w-full flex px-4">
          {/* Image Section */}
          <div className="product-img-section flex flex-col items-start w-[30%] md:w-[10%]">
            {productData.product_images &&
              productData.product_images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3003/${image}`}
                  alt={`Product Image ${index + 1}`}
                  className={`mb-2 cursor-pointer border ${selectedImage === image ? "border-black" : "border-gray-200"
                    }`}
                  onClick={() => setSelectedImage(image)} // Update the selected image on click
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
              <p className="text-gray-500 text-sm mb-2">Seller: {productData.seller}</p>
              <p className="line-through pl-1 font-mono text-gray-400">{productData.mrp}</p>
              <h2 className="text-xl font-semibold mb-4 font-mono text-orange-500">₹{productData.price}</h2>
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
                {cartItems.some((item) => item._id === productData?._id) ? (
                  <button
                    onClick={() => updateCart(productData._id)}
                    className="flex items-center flex-1 justify-center gap-1 bg-black transition-all hover:-translate-y-[1px] duration-300 text-white py-2 text-center rounded hover:text-orange-500"
                  >
                    <ion-icon name="cart-outline"></ion-icon> Update Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(productData._id)}
                    className="flex items-center flex-1 justify-center gap-1 transition-all hover:-translate-y-[1px] duration-300  bg-black hover:text-orange-500 text-white py-2 text-center rounded"
                  >
                    <ion-icon name="cart-outline"></ion-icon> Add to Cart
                  </button>
                )}
                <button onClick={()=>setIsAddressSelectingFormVisible(true)} className="flex-1 border text-black transition-all hover:-translate-y-[1px] duration-300 hover:text-orange-500 border-black py-2 text-center rounded hover:bg-black">
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
