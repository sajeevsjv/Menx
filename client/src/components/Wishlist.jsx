import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import UserNavbar from "./UserNavbar";


const Wishlist = () => {
  // Sample cart data
  const [wishlistItems, setWishlistItems] = useState([]);

  // userdata from context
  const {userData, setUserData} = useContext(DataContext);
  console.log("userdata from context : ",userData);

  const navigate = useNavigate();
  


  


  useEffect(() => {
    const loadwishlist = async () => {
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
        let wishlistdata = data.wishlist.map((item) => ({
          ...item.product,
        }));
        setWishlistItems(wishlistdata);
      }
      catch (error) {
        if (error.response) {
          console.log("eror response :", error.response);
        }
        console.log("error :", error);
      }
    };

    loadwishlist();
  }, [])
  
  const removefromwishlist = async (e,id) => {
    e.stopPropagation();
    const authToken = localStorage.getItem("authToken");
  
    try {
      let response = await axios({
        method: "DELETE",
        url: `http://localhost:3003/removefromwishlist/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });
   
      // Remove the item from wishlist in the UI immediately
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== id) // Corrected comparison: item._id is the actual product ID
      );
    } catch (error) {
      if (error.response) {
        let message = error.response.data.message;
        toast.error(message);
      }
      console.error("Error:", error);
    }
  };
  

  return (
    <>
    <UserNavbar />
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Wishlist</h2>
      <div className="space-y-6">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <div
              key={item._id}
              onClick={()=>{ navigate(`/productpage/${item._id}`)}}
              className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3003/${item.product_images[0]}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="ml-4 flex-grow">
                <h4 className="text-md font-semibold text-gray-700">{item.name.slice(0,65)}...</h4>
                <p className="font-[mono] text-orange-500">Price: ₹{item.price}</p>
              </div>
              <button
                onClick={(e) => removefromwishlist(e,item._id)}
                className="text-white text-sm py-1 bg-orange-400 rounded-full px-3 font-semibold hover:bg-red-500 duration-300 transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="empty-cart">
          <p className="text-center text-gray-500 text-lg relative">Your Wishlist is empty.</p>
          <img src={"./images/rb_1810.png"} alt="empty-cart" className="m-auto mt-5 w-[20%]" />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Wishlist;
