import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserNavbar from "./UserNavbar";

export default function EditProduct() {
  const { id } = useParams();
  const [data, setData] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    colors: [],
    categories: [],
    stock: 0,
    sizes: [],
    seller: "",
    product_images: [],
  });
  const [categoriesList, setCategoriesList] = useState([]); // List of all categories and subcategories
  const [categoryStructure, setCategoryStructure] = useState({}); // Structured category with subcategories
  const [newColor, setNewColor] = useState("#000000");
  const [newImages, setNewImages] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const sizeOptions = {
    Clothing: ["SM", "M", "L", "XL", "2XL", "3XL"],
    Shoes: ["7", "8", "9", "10", "11", "12"],
    Accessories: ["One Size"],
  };

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `http://localhost:3003/getsingleproduct/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const product = response.data.data;
        setData(product);
        setProductImages(product.product_images); // Set existing product images
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details.");
      }
    };

    // Fetch categories and subcategories
    const loadCategories = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`http://localhost:3003/categories`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const categoryData = response.data.data;
        setCategoriesList(categoryData); // Save all categories and subcategories in state

        const transformedCategories = categoryData.reduce((acc, category) => {
          acc[category.category] = category.sub_categories || [];
          return acc;
        }, {});

        setCategoryStructure(transformedCategories); // Categorize the structure
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProduct();
    loadCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addColor = () => {
    if (!data.colors.includes(newColor)) {
      setData((prevData) => ({
        ...prevData,
        colors: [...prevData.colors, newColor],
      }));
      setNewColor("#000000");
    }
  };

  const removeColor = (color) => {
    setData((prevData) => ({
      ...prevData,
      colors: prevData.colors.filter((c) => c !== color),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
  
    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Convert to base64 on load
        reader.onerror = reject;
        reader.readAsDataURL(file); // Start the conversion
      });
    });
  
    Promise.all(fileReaders)
      .then((base64Images) => {
        setNewImages((prevImages) => [...prevImages, ...base64Images]); // Add the converted images
      })
      .catch((error) => {
        console.error("Error converting files to base64:", error);
        toast.error("Failed to upload images.");
      });
  };
  
  
  // Handle canceling the selection of new images
  const cancelNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const removeImage = (index, isNewImage = false) => {
    if (isNewImage) {
      setNewImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Remove from new images
    } else {
      setData((prevData) => ({
        ...prevData,
        product_images: prevData.product_images.filter((_, i) => i !== index), // Remove from existing images
      }));
    }
  };
  

  const handleCategoryChange = (e) => {
    const { value } = e.target;
  
    setData((prevData) => {
      // Reset subcategory when category changes
      return {
        ...prevData,
        category: value,
        subcategory: "", // Reset subcategory when category changes
        sizes: [], // Reset sizes when category changes
        categories: [value], // Set the category in the categories array
      };
    });
  };
  
  

  const handleSubcategoryChange = (e) => {
    const { value } = e.target;
  
    setData((prevData) => {
      return {
        ...prevData,
        subcategory: value,
        categories: [prevData.category, value], // Add both category and subcategory to categories array
      };
    });
  };
  

  const handleSizesChange = (e) => {
    const { value, checked } = e.target;
    setData((prevData) => {
      const newSizes = checked
        ? [...prevData.sizes, value]
        : prevData.sizes.filter((size) => size !== value);
      return { ...prevData, sizes: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (data.price === 0 || data.mrp === 0 || data.stock === 0) {
      toast.info("Price, MRP, and Stock cannot be zero.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken");
  
    // Combine new base64 images with existing product images, if no new images are selected
    const updatedData = {
      ...data,
      product_images: newImages.length > 0 ? newImages : data.product_images, // Use new base64 images or keep old ones
    };
    console.log("updatedData :",updatedData);
    try {
      const response = await axios.put(
        `http://localhost:3003/updateproduct/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };
  
  

  return (
    <>
      <UserNavbar />
      <div className="main-product-form-container mt-[100px] mb-[100px] w-3/4 m-auto border-2 inset-10 bg-[#f8f8f8] rounded-lg p-5">
        <div className="product-form-container bg-transparent p-4">
          <h2 className="text-center text-md uppercase tracking-[4px] font-medium text-[#ffa333]">
            Edit Product
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={data.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="mrp">MRP</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                min="1"
                value={data.mrp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                min="1"
                value={data.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="1"
                value={data.stock}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                value={data.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {categoriesList.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <select
                name="subcategory"
                id="subcategory"
                value={data.subcategory}
                onChange={handleSubcategoryChange}
                required
              >
                <option value="">Select Subcategory</option>
                {categoryStructure[data.category]?.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection based on Category */}
            <div className="form-group">
              <label>Sizes</label>
              <div className="flex gap-4">
                {sizeOptions[data.category]?.map((size) => (
                  <label key={size}>
                    <input
                      type="checkbox"
                      value={size}
                      checked={data.sizes.includes(size)}
                      onChange={handleSizesChange}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="form-group">
              <label htmlFor="colors">Colors</label>
              <div className="flex gap-4">
                {data.colors.map((color) => (
                  <div
                    key={color}
                    className="color-box"
                    style={{
                      backgroundColor: color,
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => removeColor(color)}
                  />
                ))}
              </div>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button
                type="button"
                className="btn-add-color"
                onClick={addColor}
              >
                Add Color
              </button>
            </div>

          

    {/* Render New Image Upload */}
    <div className="form-group">
      <label htmlFor="product_images">Add New Images</label>
      <input
        type="file"
        id="product_images"
        name="product_images"
        multiple
        onChange={handleImageUpload}
      />
      <div className="flex gap-4 mt-2">
        {newImages.map((base64Image, index) => (
          <div key={index} className="relative">
            <img
              src={base64Image}
              alt={`New Image Preview ${index}`}
              className="w-20 h-20 object-cover"
            />
            <button
              type="button"
              onClick={() => cancelNewImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>

            <div className="form-group mt-4">
              <button type="submit" className="btn-submit h-12">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
