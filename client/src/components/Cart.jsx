import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "./DataProvider";


const Cart = () => {
  // Sample cart data
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState([]);

  // userdata from context
  const {userData, setUserData} = useContext(DataContext);
  console.log("userdata from context : ",userData);

  const navigate = useNavigate();
  
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );


  
  // Function to remove an item
  const removeItem = async (id) => {
    console.log("newww id :", id);
    const authToken = localStorage.getItem("authToken");
    try {
      let response = await axios({
        method: "DELETE",
        url: `http://localhost:3003/deletefromcart/${id}`,
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      })

      console.log("response :", response);
      let message = response.data.message;
      // Immediately update the state to remove the item
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
      toast.info(message);

    }
    catch (error) {
      if (error.response) {
        console.log("eror response :", error.response);
      }
      console.log("error :", error);
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

        console.log("response from 2nd useeefect :", response);
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
  

  async function placeOrder(cartItems){
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    const processingToast = toast.loading("Processing your order...");

    try {
      let response = await axios({
        method: "POST",
        url: `http://localhost:3003/placeorder/${user_id}`,
        headers: {
          "Authorization": `Bearer ${authToken}`
        },
        data : cartItems
      })

      console.log("response:", response);
      let data = response.data.data;
      console.log("response data :", data);
      let message = response.data.message;

      toast.update(processingToast, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

     setTimeout(() => {
          navigate("/shop");
      }, 2000); 
       
 
    }
    catch (error) {
      if (error.response) {
        console.log("eror response :", error.response);
        let message = error.response.data.message;
        toast.update(processingToast, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      console.log("error :", error);
      toast.update(processingToast, {
        render: "An unexpected error occurred.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }

  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Cart</h2>
      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3003/${item.product_images[0]}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="ml-4 flex-grow">
                <h4 className="text-xl font-semibold text-gray-700">{item.name}</h4>
                <p className="text-gray-600">Price: ₹{item.price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 font-semibold hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="empty-cart">
          <p className="text-center text-gray-500 text-lg relative">Your cart is empty.</p>
          <img src={"./images/11518398.jpg"} alt="empty-cart" className="m-auto mt-5 w-[20%]" />
          </div>
        )}
      </div>
      {cartItems.length > 0 &&
        <div className="mt-8  p-6  text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Total: <span className="text-green-700 text-xl font-[timesnewroman] ">₹{totalPrice.toFixed(2)}</span>
          </h3>
          <button
            onClick={()=>placeOrder(cartItems)}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      }
    </div>
  );
};

export default Cart;
