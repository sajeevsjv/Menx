import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from "./UserNavbar";
import SellerNavbar from './SellerNavbar';

const SellerEarnings = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // Default to 'all'
  const [selectedDate, setSelectedDate] = useState(''); // Store the selected date for custom date filter
  const [totalEarnings, setTotalEarnings] = useState(0); // Store total earnings

  useEffect(() => {
    const loadOrders = async () => {
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        let response = await axios({
          method: "GET",
          url: `http://localhost:3003/myearnings/${user_id}`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });

        let data = response.data.data;
        setOrders(data);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load orders');
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    // Filter orders by the selected time range or specific date
    const filterOrders = () => {
      const currentDate = new Date();
      let filteredData = [...orders];
      let total = 0;

      if (timeRange === 'all') {
        // If 'All' is selected, use all orders
        filteredData = orders;
      } else if (selectedDate) {
        // If a specific date is selected, filter by that date
        const selectedDateObj = new Date(selectedDate);
        filteredData = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === selectedDateObj.toDateString();
        });
      } else if (timeRange === 'today') {
        // Filter for today
        filteredData = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === currentDate.toDateString();
        });
      } else if (timeRange === 'thisWeek') {
        // Filter for this week
        const weekStart = currentDate.getDate() - currentDate.getDay(); // Calculate the start of the week
        const startOfWeek = new Date(currentDate.setDate(weekStart));
        filteredData = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startOfWeek;
        });
      } else if (timeRange === 'thisMonth') {
        // Filter for this month
        filteredData = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === currentDate.getMonth() && orderDate.getFullYear() === currentDate.getFullYear();
        });
      }

      // Calculate total earnings for the filtered data
      total = filteredData.reduce((sum, order) => sum + order.subtotal, 0);

      setFilteredOrders(filteredData);
      setTotalEarnings(total); // Update total earnings
    };

    filterOrders();
  }, [timeRange, selectedDate, orders]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    setSelectedDate(''); // Reset selected date when time range is changed
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Update the selected date
    setTimeRange(''); // Reset time range when a specific date is chosen
  };

  return (
    <>
      <UserNavbar />
      <SellerNavbar />
      <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">        
        {/* Dropdown for selecting the time range */}
        <div className="flex justify-center mb-6 gap-4">
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="px-4 py-2 border rounded-md text-gray-700"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>

          {/* Date Picker for selecting a specific date */}
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 border rounded-md text-gray-700"
          />
        </div>

        {/* Total Earnings for the selected time range or date */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold  text-gray-800">
            Total Earnings for <span className='font-mono text-lg text-orange-400'> {selectedDate ? new Date(selectedDate).toLocaleDateString() : timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}: ₹{totalEarnings} </span>
          </h3>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Earnings List */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6 border-[1px] rounded-md">
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="flex flex-col items-start rounded-md p-2 hover:shadow-lg transition">
                <div className='flex w-full justify-between rounded-md p-2'>
                  <h3 className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <h2 className="text-lg font-mono text-[#cc7f3c] text-center">
                    Total Earnings: ₹{order.subtotal}
                  </h2>
                </div>
                
                <div className="mt-4 w-full">
                  <h5 className="text-sm text-gray-700">Buyer: {order.buyerId.name}</h5>

                  {/* Loop through the items and display each product in a card */}
                  <div className="flex w-full gap-4 mt-4">
                    <div key={order.productId._id} className="w-full bg-orange-100 shadow-md rounded-lg p-4 flex items-center">
                      <img
                        src={`http://localhost:3003/${order.productId.product_images[0]}`}
                        alt={order.productId.name}
                        className="w-32 h-32 object-cover mr-3 rounded-md mb-4"
                      />
                      <div className='flex flex-col w-full'>
                        <h4 className="text-lg font-semibold text-gray-800">{order.productId.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">Price: ₹{order.price}</p>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantitySold}</p>
                        <p className="text-sm text-gray-600 mt-1">Subtotal: ₹{order.subtotal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SellerEarnings;
