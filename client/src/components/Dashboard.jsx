import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import AllProducts from "./AllProducts";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import Breadcrumb from "./Breadcrumb";
import BlockedProducts from "./BlockedProducts";



const Dashboard = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [allBuyers, setAllBuyers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Placeholder for products data
  const [noOfProducts, setNoOfProducts] = useState(0);
  const [noOfBlockedProducts, setNoOfBlockedProducts] = useState(0);
  const { currentView, setCurrentView} = useContext(DataContext);

  const handleAdminPanelVisible = () => {
    setIsAdminPanelVisible(!isAdminPanelVisible)
  }

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const usersResponse = await axios.get("http://localhost:3003/getallusers", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const usersData = usersResponse.data.data;

        setAllUsers(usersData.filter((user) => user.user_type.user_type !== "admin"));
        setAllBuyers(usersData.filter((user) => user.user_type.user_type === "buyer"));
        setAllSellers(usersData.filter((user) => user.user_type.user_type === "seller"));
      } catch (err) {
        if (err.response) {
          console.error("Error Response:", err.response.data);
        }
        console.error("Error:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const authToken = localStorage.getItem("authToken");
      const user_id = localStorage.getItem("user_id");
      try {
        const response = await axios.get(`http://localhost:3003/getallproducts/${user_id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const unblockedProducts = response.data.data.filter(product => product.isBlocked === false);
        const blockedProducts = response.data.data.filter(product => product.isBlocked === true);
        setNoOfBlockedProducts(blockedProducts.length);
        setNoOfProducts(unblockedProducts.length);
      } catch (error) {
        console.error("Error fetching products:", error.response || error);
      }
    };
    loadProducts();

  }, []);



  const renderTable = (data, title) => (
    <div className="user-list">
      <h2 className="text-xl font-semibold mt-7 text-gray-800 mb-4">{title}</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">user_type</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-orange-100 cursor-pointer">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td onClick={() => navigate(`/usersviewpage/${user._id}`)} className="px-4 py-2">
                    {user.name}
                  </td>

                  <td className="px-4 py-2">{user.user_type.user_type}</td>
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2"><ion-icon name="chevron-forward-outline"></ion-icon></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNav />
        {/* Content */}
        <main className="p-6 flex-1 mt-20  overflow-y-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-5 gap-6">
            <div onClick={() => setCurrentView("buyers")} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Buyers</h3>
              <p className="text-2xl font-bold">{allBuyers.length}</p>
            </div>
            <div onClick={() => setCurrentView("sellers")} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Sellers</h3>
              <p className="text-2xl font-bold">{allSellers.length}</p>
            </div>
            <div onClick={() => setCurrentView("products")} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-2xl font-bold">{noOfProducts}</p>
            </div>
            <div onClick={() => setCurrentView("blockedproducts")} className="bg-red-200 p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Blocked Products</h3>
              <p className="text-2xl font-bold">{noOfBlockedProducts}</p>
            </div>
            <div onClick={() => setCurrentView("products")} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Blocked Users</h3>
              <p className="text-2xl font-bold">{noOfProducts}</p>
            </div>
          </div>

          {/* Conditional Table Rendering */}
          {currentView === "allusers" && renderTable(allUsers, "All Users")}
          {currentView === "buyers" && renderTable(allBuyers, "All Buyers")}
          {currentView === "sellers" && renderTable(allSellers, "All Sellers")}
          {currentView === "products" && <AllProducts />}
          {currentView === "blockedproducts" && <BlockedProducts />} 
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
