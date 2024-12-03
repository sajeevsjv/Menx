import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

const Shop = () => {
  const [categories, setCategories] = useState("All Products"); // Selected category
  const [filters, setFilters] = useState({
    price: false,
    color: false,
    size: false,
    custom: false,
  });

  // Available colors
  const colors = ["#808080", "#ADD8E6", "#FFFFFF", "#FF5733", "#4CAF50"];
  // Sizes based on category
  const allSizes = ["XS", "S", "M", "L", "XL"];
  const shoeSizes = ["6", "7", "8", "9", "10", "11"];

  useEffect(()=>{
    function addProduct(){
        const authToken = localStorage.getItem("authToken")
        axios({
            url : "http://localhost:3003/getallproducts",
            method : "GET",
            headers : {
                'Authorization' : `Bearer ${authToken}`
            }
        })
        .then((response)=>{
            console.log("response :",response);
            let data = response.data.data;
        })
        .catch((error)=>{
            if(error.response){
                console.log("response :",error.response);
            }
        })
    }
    addProduct();
  },[])



  // Toggle dropdown
  const toggleFilter = (filter) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  // Dynamic size options based on category
  const sizeOptions =
    categories === "Clothing"
      ? allSizes
      : categories === "Shoes"
      ? shoeSizes
      : [...allSizes, ...shoeSizes];

  return (
    <div className="flex flex-wrap p-6">
      {/* Sidebar Section */}
      <aside className="w-full lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow">
        {/* Browse By Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">Browse By</h3>
          <ul className="space-y-2">
            {["All Products", "New In", "Tops", "Bottoms", "Clothing", "Shoes", "Accessories", "On Sale"].map((category) => (
              <li
                key={category}
                className={`cursor-pointer ${
                  categories === category ? "text-blue-600 font-bold" : "text-gray-700"
                }`}
                onClick={() => setCategories(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Filter By Section */}
        <h3 className="font-bold text-lg mb-4">Filter By</h3>

        {/* Price Filter */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFilter("price")}
          >
            <span className="font-medium text-gray-700">Price</span>
            <button className="text-xl font-bold">
              {filters.price ? "−" : "+"}
            </button>
          </div>
          {filters.price && (
            <div className="mt-2">
              <input type="range" min="10" max="100" className="w-full" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$10</span>
                <span>$100</span>
              </div>
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFilter("color")}
          >
            <span className="font-medium text-gray-700">Color</span>
            <button className="text-xl font-bold">
              {filters.color ? "−" : "+"}
            </button>
          </div>
          {filters.color && (
            <div className="mt-2 flex gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 border rounded-full cursor-pointer"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFilter("size")}
          >
            <span className="font-medium text-gray-700">Size</span>
            <button className="text-xl font-bold">
              {filters.size ? "−" : "+"}
            </button>
          </div>
          {filters.size && (
            <div className="mt-2">
              <ul className="space-y-1">
                {sizeOptions.map((size) => (
                  <li key={size} className="text-gray-600 cursor-pointer">
                    {size}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Custom Filter */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleFilter("custom")}
          >
            <span className="font-medium text-gray-700">Custom Filter</span>
            <button className="text-xl font-bold">
              {filters.custom ? "−" : "+"}
            </button>
          </div>
          {filters.custom && (
            <div className="mt-2">
              <p className="text-gray-600">Custom filter content goes here.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Section */}
      <main className="w-full lg:w-3/4 p-6">
        <h2 className="text-xl font-bold mb-4">
          Showing products for: {categories}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample product card */}
          <div className="bg-white p-4 shadow rounded-lg">
            <div className="bg-gray-200 h-48 mb-4 rounded"></div>
            <h3 className="font-medium text-lg">Product Name</h3>
            <p className="text-gray-500">$20</p>
          </div>
          {/* Add more product cards dynamically */}
        </div>
      </main>
    </div>
  );
};

export default Shop;
