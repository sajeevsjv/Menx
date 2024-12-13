import React, { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import SellerNavbar from "./SellerNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    seller: "",
  });

  const [categoryStructure, setCategoryStructure] = useState({});
  const [newColor, setNewColor] = useState("#000000");

  // Load categories only once when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:3003/categories", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const categoryData = response.data.data;
        const transformedCategories = categoryData.reduce((acc, category) => {
          acc[category.category] = category.sub_categories || [];
          return acc;
        }, {});
        setCategoryStructure(transformedCategories);
      } catch (error) {
        console.error("Error loading categories:", error.response || error);
      }
    };

    loadCategories();
  }, []);

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
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "mrp" ? parseFloat(value) : value,
    }));
  };

  const toggleCategory = (mainCategory, subCategory = null) => {
    setData((prevData) => {
      const existingCategories = new Set(prevData.categories);

      if (!subCategory) {
        if (existingCategories.has(mainCategory)) {
          categoryStructure[mainCategory].forEach((sub) =>
            existingCategories.delete(sub)
          );
          existingCategories.delete(mainCategory);
        } else {
          existingCategories.add(mainCategory);
        }
      } else {
        if (existingCategories.has(subCategory)) {
          existingCategories.delete(subCategory);
          const hasOtherSelected = categoryStructure[mainCategory].some((sub) =>
            existingCategories.has(sub)
          );
          if (!hasOtherSelected) existingCategories.delete(mainCategory);
        } else {
          existingCategories.add(subCategory);
          existingCategories.add(mainCategory);
        }
      }

      return { ...prevData, categories: Array.from(existingCategories) };
    });
  };

  const toggleSize = (size) => {
    setData((prevData) => ({
      ...prevData,
      sizes: prevData.sizes.includes(size)
        ? prevData.sizes.filter((s) => s !== size)
        : [...prevData.sizes, size],
    }));
  };

  // Memoize available sizes based on selected categories
  const availableSizes = useMemo(() => {
    if (data.categories.includes("Clothing")) return sizeOptions.Clothing;
    if (data.categories.includes("Shoes")) return sizeOptions.Shoes;
    return [];
  }, [data.categories]);

  // Handle image drop
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prevData) => ({
          ...prevData,
          product_images: [...prevData.product_images, reader.result],
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
    const authToken = localStorage.getItem("authToken");
    const user_id = localStorage.getItem("user_id");
    const payload = { ...data, seller: user_id };

    try {
      const response = await axios.post("http://localhost:3003/addproduct", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error submitting product:", error.response || error);
    }
  };

  return (
    <>
      <SellerNavbar />
      <ToastContainer />
      <div className="main-product-form-container ...">
        {/* Form structure remains the same */}
      </div>
    </>
  );
}
