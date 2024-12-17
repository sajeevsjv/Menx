import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

//   if (!orders || orders.length === 0) {
//     return (
//       <div className="text-center">
//         <p className="text-lg text-gray-500">You have no orders yet.</p>
//       </div>
//     );
//   }
   
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
        setOrders([data]);
       
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
  
 console.log("orders :",orders); 

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col items-start bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h4 className="text-xl font-semibold text-gray-700">Order ID: {order._id}</h4>
            <p className="text-gray-600">Total Amount: ₹{order.totalAmount}</p>
            <p className="text-gray-600">Order Status: {order.status}</p>
            <div className="mt-4 w-full">
              <h5 className="text-lg font-semibold text-gray-700">Items:</h5>
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-gray-600">
                  <span>{item.productName}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ₹{item.price}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate(`/order/${order._id}`)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              View Order Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
