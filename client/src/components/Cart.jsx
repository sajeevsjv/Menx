import React, { useState ,useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  // Sample cart data
  const [cartItems, setCartItems] = useState([]);
  const [showProduct, setShowProduct] = useState(true)

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Function to remove an item
  const removeItem = async  (id) => {
    console.log("newww id :",id);
  const authToken = localStorage.getItem("authToken");
    try{
      let response = await axios({
        method : "DELETE",
        url : `http://localhost:3003/deletefromcart/${id}`,
        headers :{
          "Authorization" :  `Bearer ${authToken}`
        }
      })
    
        console.log("response :",response);
        let message = response.data.message;
        setShowProduct(false);
        toast.info(message);
        
        
        
    }
    catch(error){
      if(error.response){
        console.log("eror response :",error.response);
      }
      console.log("error :",error);
    }
  };

  useEffect(()=>{
    const loadCart = async ()=> {
      console.log("loadcart executed")
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try{
        let response = await axios({
          method : "GET",
          url : `http://localhost:3003/getsingleuser/${user_id}`,
          headers :{
            "Authorization" :  `Bearer ${authToken}`
          }
        })
      
          console.log("response from 2nd useeefect :",response);
          let data = response.data.data;
          console.log("response data :",data);
          let cart = data.cart.map(item => item.product);
          setCartItems(cart);
      }
      catch(error){
        if(error.response){
          console.log("eror response :",error.response);
        }
        console.log("error :",error);
      }
    };

    loadCart();
  },[])
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Cart</h2>
      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3003/${item.product_images[0]}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="ml-4 flex-grow">
                <h4 className="text-xl font-semibold text-gray-700">{item.name}</h4>
                <p className="text-gray-600">Price: ${item.price}</p>
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
          <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
        )}
      </div>
      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Total: <span className="text-green-500">${totalPrice.toFixed(2)}</span>
        </h3>
        <button
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
