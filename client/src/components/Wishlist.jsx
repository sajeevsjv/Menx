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
  const [cartItems, setCartItems] = useState([]);


  // userdata from context
  const { userData, setUserData } = useContext(DataContext);
  console.log("userdata from context : ", userData);

  const navigate = useNavigate();

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
        let cart = data.cart.map(item => item.product._id);
        setCartItems(cart);
        let wishlist = data.wishlist.map(item => item.product);
        console.log("wishlist :", wishlist);
        setWishlistItems(wishlist);

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

  const addToCart = async (e, id) => {
    e.stopPropagation();
    const user_id = localStorage.getItem("user_id");
    const product_id = id;
    const authToken = localStorage.getItem("authToken");
    if (!user_id || !authToken) {
      toast.error("Please login to continue.");
      return;
    }


    try {
      let response = await axios({
        method: "POST",
        url: "http://localhost:3003/addtocart",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        data: {
          user_id,
          product_id
        }
      });

      console.log("response :", response);
      let message = response.data.message;
      // toast.success(message,{
      //   autoClose: 2000,
      //   position: "top-center"
      // });
      setCartItems((prevCartItems) => [...prevCartItems, id]); // Add the product id to the cart state


    }
    catch (error) {
      if (error.response) {
        let message = error.response.data.message;
        toast.error(message);
      }
      console.log("error :", error);
    }

  }

  const handleGotoCartClick = (e) => {
    e.stopPropagation();
    navigate("/cart");
  }





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

  const removefromwishlist = async (e, id) => {
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
      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white  rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Wishlist</h2>
        <div className="space-y-6">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div
                key={item._id}
                onClick={() => { navigate(`/productpage/${item._id}`) }}
                className="flex items-center cursor-pointer bg-gray-50 p-4 rounded-lg shadow-lg border-b-[5px] border-b-orange-300  hover:shadow-xl transition"
              >
                <img
                  src={`http://localhost:3003/${item.product_images[0]}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <h4 className="text-md font-semibold text-gray-700">{item.name.slice(0, 65)}...</h4>
                  <p className="font-[mono] text-orange-500">Price: ₹{item.price}</p>
                  <button
                  onClick={(e) => removefromwishlist(e, item._id)}
                  className="text-white text-xs flex gap-1  mt-1 py-1  rounded-full px-3 font-medium bg-gray-400 duration-300 transition"
                >
                  Remove
                </button>
                </div>
                <div className="flex flex-col gap-2">
                {cartItems.length > 0 && cartItems.includes(item._id) ? (
                  <span>
                    <button onClick={(e) => { handleGotoCartClick(e) }} className="text-orange-500 hover:text-black bg-transparent outline-none  border-none text-sm font-medium tracking-wide  px-4 py-1 flex justify-center gap-2">
                      Go to Cart    <ion-icon name="arrow-forward-outline"></ion-icon>
                    </button>
                  </span>
                ) : (
                  <span>
                    <button
                      className="px-4 py-[6px] text-sm text-orange-500 font-medium tracking-wide bg-transparent outline-none hover:text-black rounded-full flex justify-center gap-1"
                      onClick={(e) => addToCart(e, item._id)}
                    >
                     <ion-icon name="add-outline"></ion-icon> Add to Cart
                    </button>
                  </span>
                )}

              </div>
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
