import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios"
import SellerNavbar from "./SellerNavbar";
const categoryStructure = {
  Clothing: [
    "T-Shirts & Polos",
    "Shirts",
    "Trousers",
    "Jeans",
    "Innerwear",
    "Sportswear",
    "Sleep & Lounge Wear",
    "Ethnic Wear",
    "Ties, Socks & Belts",
    "Suits & Blazers",
    "Sweaters",
    "Jackets & Coats",
  ],

  Shoes: [
    "Sports Shoes",
    "Formal Shoes",
    "Casual Shoes",
    "Sneakers",
    "Loafers & Moccasins",
    "Flip-Flops",
    "Boots",
    "Sandals & Floaters",
    "Thong Sandals",
    "Boat Shoes",
  ],
  Watches: ["Metallic", "Chronographs", "Leather"],
  Jewellery: ["Rings", "Bracelets"],
  Eyewear: ["Sunglasses", "Spectacle Frames"],
  Wallets: [],
};

const sizeOptions = {
  Clothing: ["SM", "M", "L", "XL", "2XL", "3XL"],
  Shoes: ["7", "8", "9", "10", "11", "12"],
};

export default function AddProduct() {

  const [data, setData] = useState({
    name: "",
    description: "",
    mrp: "",
    price: "",
    colors: "",
    categories: [], // Holds main categories and selected subcategories
    product_images: [], // Holds selected product images
    product_count: 0,
    sizes: []
  });

  const [newColor, setNewColor] = useState("#000000"); // Temporary color input state

  const addColor = (color) => {
    if (!data.colors.includes(color)) {
      setData((prevData) => ({
        ...prevData,
        colors: [...prevData.colors, color],
      }));
    }
  };

  const removeColor = (color) => {
    setData((prevData) => ({
      ...prevData,
      colors: prevData.colors.filter((c) => c !== color),
    }));
  };

  const handleChange = (e) => {
    console.log("handle change worked");
    const { name, value } = e.target;

    if (name === "price" || name === "mrp") {
      setData((prevData) => ({
        ...prevData,
        [name]: parseFloat(value), // Use parseInt(value) if you expect integers
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  const toggleCategory = (mainCategory, subCategory = null) => {
    setData((prevData) => {
      const existingCategories = new Set(prevData.categories);

      // Handle main category toggle
      if (!subCategory) {
        if (existingCategories.has(mainCategory)) {
          // Remove main category and all its subcategories
          categoryStructure[mainCategory].forEach((sub) => existingCategories.delete(sub));
          existingCategories.delete(mainCategory);
        } else {
          // Add main category
          existingCategories.add(mainCategory);
        }
      } else {
        // Handle subcategory toggle
        if (existingCategories.has(subCategory)) {
          // Remove subcategory
          existingCategories.delete(subCategory);

          // If no subcategories are left, remove the main category
          const hasOtherSelected = categoryStructure[mainCategory].some((sub) =>
            existingCategories.has(sub)
          );
          if (!hasOtherSelected) existingCategories.delete(mainCategory);
        } else {
          // Add subcategory and ensure main category is included
          existingCategories.add(subCategory);
          existingCategories.add(mainCategory);
        }
      }

      return { ...prevData, categories: Array.from(existingCategories) };
    });
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setData((prevData) => ({
      ...prevData,
      sizes: prevData.sizes.includes(size)
        ? prevData.sizes.filter((s) => s !== size)
        : [...prevData.sizes, size],
    }));
  };

  // Get available size options based on category
  const getAvailableSizes = () => {
    if (data.categories.includes("Clothing")) return sizeOptions.Clothing;
    if (data.categories.includes("Shoes")) return sizeOptions.Shoes;
    return [];
  };

  // Handle image drop and convert to Base64
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prevData) => ({
          ...prevData,
          product_images: [
            ...prevData.product_images, reader.result  // Store Base64 string
          ],
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64 string
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data :", data);

    const authToken = localStorage.getItem("authToken");
    console.log("authtoken :", authToken);


    try {

      let response = await axios({
        url: "http://localhost:3003/addproduct",
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        data

      })
      console.log("response :", response);
      console.log("message :", response.data.message);
    }
    catch (error) {
      if (error.response) {
        console.log("response msg ", error.response.data.message);
        return
      }
      console.log(error.message ? error.message : error)
    }

  }

  return (
    <>
      <SellerNavbar />
      <div className="main-product-form-container mt-[50px] mb-[100px] w-3/4 m-auto border-2 inset-10 bg-[#f8f8f8] rounded-lg p-5">
        <div className="product-form-container bg-transparent p-4">
          <h2 className="text-center text-md uppercase tracking-[4px] font-medium text-[#ffa333]">
            Add Product
          </h2>
          <form action="/submit" method="POST" enctype="multipart/form-data" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter product name"
                required=""
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Enter product description"
                required=""
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mrp">MRP</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                min="1"
                step="1"
                placeholder="Enter MRP"
                required=""
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                min="1"
                step="1"
                placeholder="Enter price"
                required=""
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Product Count</label>
              <input type="number"
                name="product_count"
                min="1"
                step="1"
                onChange={handleChange}
              />
            </div>

            {/* Category Selection Section */}
            <div className="w-full mx-auto pt-2">
              <h2 className="text-md mb-4 text-gray-800">Select Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.keys(categoryStructure).map((mainCategory) => (
                  <div key={mainCategory} className="border p-4 rounded-lg bg-gray-100">
                    {/* Main Category */}
                    <label className="flex pb-3 items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.categories.includes(mainCategory)}
                        onChange={() => toggleCategory(mainCategory)}
                        className="h-5 w-5 text-orange-400 focus:ring-orange-400 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 text-sm font-semibold">
                        {mainCategory}
                      </span>
                    </label>

                    {/* Subcategories */}
                    <div className="ml-6 mt-2 grid grid-cols-1 gap-2">
                      {categoryStructure[mainCategory].map((subCategory) => (
                        <label
                          key={subCategory}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={data.categories.includes(subCategory)}
                            onChange={() => toggleCategory(mainCategory, subCategory)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-600 text-sm">{subCategory}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {getAvailableSizes().length > 0 && (
              <div className="form-group mt-4">
                <h3 className="text-md  text-gray-800 mb-4">
                  Select Sizes
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {getAvailableSizes().map((size) => (
                    <label
                      key={size}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={size}
                        checked={data.sizes.includes(size)}
                        onChange={() => toggleSize(size)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}


            {/* Image Upload Section */}
            <div className="mt-6">
              <h3 className="text-md mb-2  text-gray-800">Upload Product Images</h3>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-14 text-center cursor-pointer hover:border-indigo-500 transition"
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">
                  Drag and drop images here, or click to select files
                </p>
                <em className="text-xs text-gray-400">(Only *.jpeg, *.png, *.jpg, *.gif)</em>
              </div>

              {/* Preview Selected Images */}
              {data.product_images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {data.product_images.map((base64String, index) => (
                    <div
                      key={index}
                      className="relative w-full h-32 border rounded-lg overflow-hidden"
                    >
                      <img
                        src={base64String} // Use the Base64 string directly as the src
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}


            </div>

            <div className="form-group mt-4">
              <h3 className="text-md mb-2">Select available colors of the product</h3>
              <div className="flex items-center space-x-4">
                {/* Color Picker */}
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="h-12 rounded-lg w-[10%] p-0 border-none"
                />
                <button
                  type="button"
                  onClick={() => addColor(newColor)}
                  className="px-4 py-2 bg-orange-400 text-sm tracking-wider text-white rounded"
                >
                  Add Color
                </button>
              </div>

              {/* Display Selected Colors */}
              {data.colors.length > 0 && (
                <div className="mt-4">
                  <h4>Selected Colors:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-100 p-2 rounded"
                      >
                        <div
                          className="w-5 h-5 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="px-2 py-1 bg-red-500 text-xs tracking-wider  text-white rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>


            <div className="form-group  mt-10">
              <button type="submit" className="btn-submit h-12">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
