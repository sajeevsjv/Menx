import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import UserNavbar from "./UserNavbar";


const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      console.log("loadorders executed")
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        let response = await axios({
          method: "GET",
          url: `http://localhost:3003/myorders/${user_id}`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })

        console.log("response from 2nd useefect :", response);
        let data = response.data.data;
        console.log("response data :", data);
        setOrders(data);

      }
      catch (error) {
        if (error.response) {
          console.log("eror response :", error.response);
        }
        console.log("error :", error);
      }
    };

    loadOrders();
  }, [])

  console.log("orders :", orders);

  return (
    <>
    <UserNavbar />
    <div className="max-w-4xl mx-auto mt-24 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">My Orders</h2>
      <div className="space-y-6 border-[1px] rounded-md">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col items-start rounded-md  p-2   hover:shadow-lg transition"
          > 
            <div className='flex  w-full justify-between rounded-md  p-2'> 
            <h3 className="text-gray-600 ">
              {new Date(order.orderDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <h2 className="text-lg font-mono text-[#cc7f3c] text-center ">Total Amount: ₹{order.totalAmount}</h2>
            <p className="text-xs  text-gray-400 tracking-wider">Order ID: {order._id}</p>
            </div>
            
            <div className="mt-4 w-full">
              <h5 className="text-sm  text-gray-700">Items:</h5>
              {order.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center rounded-md bg-orange-100 p-4  transition"
                >
                  <img
                    src={`http://localhost:3003/${item.productId.product_images[0]}`}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-grow">
                    <h4 className="text-xl font-semibold text-gray-700">{item.productId.name.slice(0, 70)}...</h4>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Orders;
