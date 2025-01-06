import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import UserNavbar from "./UserNavbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [newQuantities, setNewQuantities] = useState({}); // Track new quantities
  const [changedItemId, setChangedItemId] = useState(null); // Track which item is being edited
  const [isAddressSelectingFormVisible, setIsAddressSelectingFormVisible] = useState(false);
  const [address, setAddress] = useState();

  const { userData } = useContext(DataContext);
  console.log("userdataaaaaaaaa :", userData);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (newQuantities[item._id] || item.quantity),
    0
  );

  // Handle increment of quantity
  const incrementQuantity = (itemId) => {
    setNewQuantities((prev) => {
      const newQuantity = (prev[itemId] || cartItems.find((item) => item._id === itemId).quantity) + 1;
      setChangedItemId(itemId); // Mark the item being changed
      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  // Handle decrement of quantity
  const decrementQuantity = (itemId) => {
    setNewQuantities((prev) => {
      const newQuantity = Math.max(
        1,
        (prev[itemId] || cartItems.find((item) => item._id === itemId).quantity) - 1
      );
      setChangedItemId(itemId); // Mark the item being changed
      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  // Update quantity in the backend
  const updateQuantity = async (itemId) => {
    const authToken = localStorage.getItem("authToken");
    const newQuantity = newQuantities[itemId];  // Get the updated quantity for the specific item
    const user_id = localStorage.getItem("user_id");

    // Get the previous quantity and stock value before attempting the update
    const item = cartItems.find(item => item._id === itemId);
    const stock = item?.stock;  // Assuming 'stock' holds the default stock value in the backend

    try {
      const response = await axios.patch(
        `http://localhost:3003/updatecart`,  // Endpoint for updating cart quantity
        { quantity: newQuantity, user_id, product_id: itemId },  // Data to send in the request body
        {
          headers: { Authorization: `Bearer ${authToken}` },  // Authorization header with token
        }
      );

      if (response.status === 200) {
        // Handle success response
        const msg = response.data.message || "Quantity updated successfully!";
        toast.success(msg);

        // Update local state to reflect the new quantity
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        setChangedItemId(null); // Reset the changed flag
      }
    } catch (error) {
      // If there's an error, reset the quantity to the original stock
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: stock } : item
        )
      );

      // Display the error message from the backend or a default message
      const msg = error.response?.data?.message || "Failed to update quantity. Restoring to stock quantity.";
      toast.error(msg);

      console.error("Error updating quantity:", error.response || error);
    }
  };




  // Function to remove an item
  const removeItem = async (e, id) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.delete(`http://localhost:3003/deletefromcart/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Item removed from cart!");
      // Immediately update the state to remove the item
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("Error removing item.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`http://localhost:3003/getsingleuser/${user_id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setAddress(response.data.data.address)

        const cartWithQuantities = response.data.data.cart.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        setCartItems(cartWithQuantities);
      } catch (error) {
        console.error("Error loading cart:", error.response || error);
      }
    };

    loadCart();
  }, []);

  console.log("adress :", address);

  const placeOrder = async () => {
    setIsAddressSelectingFormVisible(false);
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    const processingToast = toast.loading("Processing your order...", {
      position: "bottom-center",
    });    
    const productsInfo = cartItems;
    const isFromCart = true;

    try {
      const response = await axios.post(
        `http://localhost:3003/placeorder/${user_id}`,
        { productsInfo, totalAmount: totalPrice, isFromCart },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.update(processingToast, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => navigate("/shop"), 2000);
    } catch (error) {
      toast.update(processingToast, {
        render: error.response?.data.message || "An unexpected error occurred.",
        type: "error",
        position: "bottom-center",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  console.log("adress :", address)
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

      <div className="max-w-4xl mt-20 mx-auto p-6 bg-white  rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Cart</h2>
        <div className="space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center cursor-pointer bg-gray-50 p-4 py-5 rounded-lg shadow-lg border-b-[5px] border-b-orange-300  hover:shadow-xl transition"
              >
                <img
                  src={`http://localhost:3003/${item.product_images[0]}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <h4 className="text-md font-semibold text-gray-700">
                    {item.name.slice(0, 70)}...
                  </h4>
                  <p className="text-orange-400 font-mono">Price: ₹{item.price}</p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md font-semibold"
                    >
                      -
                    </button>
                    <span className="text-gray-700 font-semibold">
                      {newQuantities[item._id] || item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md font-semibold"
                    >
                      +
                    </button>
                  </div>
                  {changedItemId === item._id && (
                    <button
                      onClick={() => updateQuantity(item._id)}
                      className="mt-3 text-white text-xs px-3 py-1 bg-green-400 font-semibold rounded-full transition"
                    >
                      Update Quantity
                    </button>
                  )}
                  <button
                    onClick={(e) => removeItem(e, item._id)}
                    className="mt-3 text-white text-xs px-3 py-1 bg-red-400 font-semibold rounded-full transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="mt-8 p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800">
              Total:{" "}
              <span className="text-green-700 text-xl font-[mono]">
                ₹{totalPrice.toFixed(2)}
              </span>
            </h3>
            <button
              onClick={() => setIsAddressSelectingFormVisible(true)}
              className="mt-4 px-6 py-2 bg-black text-white rounded-sm font-semibold hover:bg-orange-400 hover:-translate-y-1 duration-300 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
