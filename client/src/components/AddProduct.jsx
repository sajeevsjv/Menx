import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    categories: [],
    product_images: [],
    Stock: 0,
    sizes: [],
    seller: ""
  });

  const [categoryStructure, setCategoryStructure] = useState({});
  const [newColor, setNewColor] = useState("#000000");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        let response = await axios({
          method: "GET",
          url: `http://localhost:3003/categories`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });

        let categoryData = response.data.data;
        const transformedCategories = categoryData.reduce((acc, category) => {
          acc[category.category] = category.sub_categories || [];
          return acc;
        }, {});
        setCategoryStructure(transformedCategories);
      }
      catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleNumberChange = (e, fieldName) => {
    const value = e.target.value;
    if (value >= 0) {
      setData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  }

  const toggleSize = (size) => {
    setData((prevData) => ({
      ...prevData,
      sizes: prevData.sizes.includes(size)
        ? prevData.sizes.filter((s) => s !== size)
        : [...prevData.sizes, size],
    }));
  };

  const getAvailableSizes = () => {
    if (data.categories.includes("Clothing")) return sizeOptions.Clothing;
    if (data.categories.includes("Shoes")) return sizeOptions.Shoes;
    return [];
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prevData) => ({
          ...prevData,
          product_images: [
            ...prevData.product_images, reader.result
          ],
        }));
      };
      reader.readAsDataURL(file);
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
  
    // Validation: Check if price, mrp, or stock is 0
    if (data.price === 0 || data.mrp === 0 || data.Stock === 0) {
      toast.info("Price, MRP, and Stock cannot be zero.");
      return;
    }
  
    // Basic validation checks
    if (!data.name || !data.description || !data.price || !data.mrp || !data.Stock) {
      toast.error("Please fill in all the required fields.");
      return;
    }
  
    // Additional validation for price, MRP, and stock to be positive numbers
    if (data.price <= 0 || data.mrp <= 0 || data.Stock < 0) {
      toast.error("Price, MRP, and Stock must be positive numbers.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken");
    const user_id = localStorage.getItem("user_id");
    const payload = { ...data, seller: user_id };
  
    try {
      let response = await axios({
        url: "http://localhost:3003/addproduct",
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        data: payload
      });
      toast.success(response.data.message);
    }
    catch (error) {
      console.error("Error submitting product:", error);
    }
  };
  

  return (
    <>
      <UserNavbar />
      <div className="main-product-form-container mt-[100px] mb-[100px] w-3/4 m-auto border-2 inset-10 bg-[#f8f8f8] rounded-lg p-5">
        <div className="product-form-container bg-transparent p-4">
          <h2 className="text-center text-md uppercase tracking-[4px] font-medium text-[#ffa333]">
            Add Product
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter product name"
                onChange={handleChange}
                required
              />
            </div>

            {/* Product Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                onChange={handleChange}
                required
              />
            </div>

            {/* Price and MRP */}
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Enter product price"
                value={data.price}
                onChange={(e) => handleNumberChange(e, 'price')}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mrp">MRP</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                placeholder="Enter product MRP"
                value={data.mrp}
                onChange={(e) => handleNumberChange(e, 'mrp')}
                min="1"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div className="form-group">
              <label htmlFor="Stock">Stock</label>
              <input
                type="number"
                id="Stock"
                name="Stock"
                placeholder="Enter stock quantity"
                value={data.Stock}
                onChange={(e) => handleNumberChange(e, 'Stock')}
                min="1"
                required
              />
            </div>

            {/* Category Selection - Main and Subcategory Dropdowns */}
            <div className="form-group">
              <label htmlFor="mainCategory">Main Category</label>
              <select
                id="mainCategory"
                name="mainCategory"
                value={selectedMainCategory}
                onChange={(e) => setSelectedMainCategory(e.target.value)}
                required
              >
                <option value="">Select Main Category</option>
                {Object.keys(categoryStructure).map((mainCategory) => (
                  <option key={mainCategory} value={mainCategory}>
                    {mainCategory}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subCategory">Subcategory</label>
              <select
                id="subCategory"
                name="subCategory"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedMainCategory}
                required
              >
                <option value="">Select Subcategory</option>
                {selectedMainCategory &&
                  categoryStructure[selectedMainCategory].map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
              </select>
            </div>

            {/* Size Selection */}
            {getAvailableSizes().length > 0 && (
              <div className="form-group mt-4">
                <h3 className="text-md text-gray-800 mb-4">Select Sizes</h3>
                <div className="grid grid-cols-3 gap-4">
                  {getAvailableSizes().map((size) => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
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

            {/* Image Upload */}
            <div className="mt-6">
              <h3 className="text-md mb-2 text-gray-800">Upload Product Images</h3>
              <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-14 text-center cursor-pointer hover:border-indigo-500 transition">
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">Drag and drop images here, or click to select files</p>
                <em className="text-xs text-gray-400">(Only *.jpeg, *.png, *.jpg, *.gif)</em>
              </div>

              {/* Preview Images */}
              {data.product_images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {data.product_images.map((base64String, index) => (
                    <div key={index} className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <img src={base64String} alt={`preview-${index}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="form-group mt-4">
              <h3 className="text-md mb-2">Select Available Colors of the Product</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="h-12 rounded-lg w-[10%] p-0 border-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!data.colors.includes(newColor)) {
                      setData((prevData) => ({
                        ...prevData,
                        colors: [...prevData.colors, newColor],
                      }));
                    }
                  }}
                  className="px-4 py-2 bg-orange-400 text-sm tracking-wider text-white rounded"
                >
                  Add Color
                </button>
              </div>
              {data.colors.length > 0 && (
                <div className="mt-4">
                  <h4>Selected Colors:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prevData) => ({
                              ...prevData,
                              colors: prevData.colors.filter((c) => c !== color),
                            }));
                          }}
                          className="px-2 py-1 bg-red-500 text-xs tracking-wider text-white rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group mt-10">
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
