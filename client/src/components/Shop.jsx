import React, { useState, useEffect } from "react";
import axios from "axios";

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
  Accessories: ["Watches", "Jewellery", "Eyewear", "Wallets"],
};

const Shop = () => {
  const [categories, setCategories] = useState("All Products");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:3003/getallproducts", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setAllProducts(response.data.data);
        setFilteredProducts(response.data.data); // Default to all products
      } catch (error) {
        console.error("Error fetching products:", error.response || error);
      }
    };
    loadProducts();
  },[]);
  
  console.log("allproducts",allProducts);

  // Handle main category selection
  const handleCategoryChange = (category) => {
    console.log("category:",category);
    setCategories(()=> category);
    console.log("categories :",categories);
    setSubcategories(categoryStructure[category] || []);
    setSelectedSubcategories([]);

    // Filter products by main category
    if (category === "All Products") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        Array.isArray(product.categories)
          ? product.categories.includes(category)
          : product.category === category
      );
      setFilteredProducts(filtered);
      console.log("filterd_products :",filteredProducts);
      console.log("category :",category);
    }
  };
  console.log("categories after  :",categories);
  console.log("subcategories :",subcategories);


  // Handle subcategory selection (multiple selection with checkboxes)
  const toggleSubcategory = (subcategory) => {
    const updatedSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((sub) => sub !== subcategory) // Deselect subcategory
      : [...selectedSubcategories, subcategory]; // Add new subcategory
    setSelectedSubcategories(updatedSubcategories);
    console.log("subcategories last :",subcategories);
    console.log("updated_subcategories :",updatedSubcategories);


    // Filter products by main category and selected subcategories
    const filtered = allProducts.filter((product) => {
      const matchesCategory =
        categories === "All Products" ||
        (Array.isArray(product.categories)
          ? product.categories.includes(categories)
          : product.category === categories);

          const matchesSubcategories =
          updatedSubcategories.length === 0 ||
          updatedSubcategories.some((sub) =>
            Array.isArray(product.categories)
              ? product.categories.some((prodSub) => prodSub.trim().toLowerCase() === sub.trim().toLowerCase())
              : product.category.trim().toLowerCase() === sub.trim().toLowerCase()
          );
        
      console.log("matches_category :",matchesCategory);
      console.log("matches_subcategory :",matchesSubcategories)
      return matchesCategory && matchesSubcategories;
    });
    
    console.log("filterd :",filtered);
    setFilteredProducts(filtered);
  };


  const resetFilters = () => {
    setCategories("All Products");
    setSubcategories([]);
    setSelectedSubcategories([]);
    setFilteredProducts(allProducts);
  };

  return (
    <div className="flex flex-wrap p-6">
      <aside className="w-full lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow">
        <div className="mb-6">
          <h3 className="font-bold text-lg">Browse By</h3>
          <ul className="space-y-2 mt-2">
            {["All Products", "Clothing", "Shoes", "Accessories"].map((category) => (
              <li
                key={category}
                className={`cursor-pointer ${
                  categories === category ? "text-blue-600 font-bold" : "text-gray-700"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {subcategories.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Subcategories</h4>
            <ul className="space-y-1">
              {subcategories.map((subcategory) => (
                <li key={subcategory}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(subcategory)}
                      onChange={() => toggleSubcategory(subcategory)}
                    />
                    <span
                      className={`${
                        selectedSubcategories.includes(subcategory)
                          ? "text-blue-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {subcategory}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="w-full bg-red-500 text-white py-2 rounded-lg mt-4"
          onClick={resetFilters}
        >
          Clear Filters
        </button>
      </aside>

     

      <div className="main-grid-container w-full lg:w-3/4  flex flex-col items-center  justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-xl newin uppercase">
                        {categories}
                    </span>
                </div>
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center  gap-4  w-11/12">
                 {filteredProducts.map((product)=> (
                     <div className="product-card">
                     <div className="product-image">
                         <img src={`http://localhost:3003/${product.product_images[0]}`} alt="Product Image" />
                         <button className="wishlist-btn">
                             ❤
                         </button>
                     </div>
                     <div className="product-details">
                         <h3 className="product-name">
                             {product.name}
                         </h3>
                         <p className="product-price">
                             {product.price}
                         </p>
                     </div>
                     <div className="product-actions">
                         <button className="add-to-cart flex justify-center gap-1">
                             <ion-icon name="cart"></ion-icon> Add to Cart
                         </button>
                     </div>
                 </div>
                 ))}
                   
                    


                </div>
            </div>
    </div>
  );
};

export default Shop;
