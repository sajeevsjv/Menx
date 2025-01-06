import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import BlockProductForm from "./BlockProductForm";
import UnblockProductForm from "./UnblockProduct";

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

const AllProducts = () => {
  const [categories, setCategories] = useState("All Products");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { totalProductsCount, setTotalProductsCount } = useContext(DataContext);
  const [isBlockFormVisible, setIsBlockFormVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isUnblockFormVisible, setIsUnblockFormVisible] = useState(false);
  const [blockedItems, setBlockedItems] = useState([]);


  const navigate = useNavigate();

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      const authToken = localStorage.getItem("authToken");
      const user_id = localStorage.getItem("user_id");
      try {
        const response = await axios.get(`http://localhost:3003/getallproducts/${user_id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const unblockedProducts = response.data.data.filter(product => product.isBlocked === false);
        setAllProducts(unblockedProducts);
        setFilteredProducts(unblockedProducts); // Default to all products
      } catch (error) {
        console.error("Error fetching products:", error.response || error);
      }
    };
    loadProducts();

  }, []);





  console.log("allproducts", allProducts);
  setTotalProductsCount(allProducts?.length);

  // Handle main category selection
  const handleCategoryChange = (category) => {
    console.log("category:", category);
    setCategories(() => category);
    console.log("categories :", categories);
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
      console.log("filterd_products :", filteredProducts);
      console.log("category :", category);
    }
  };
  console.log("categories after  :", categories);
  console.log("subcategories :", subcategories);


  // Handle subcategory selection (multiple selection with checkboxes)
  const toggleSubcategory = (subcategory) => {
    const updatedSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((sub) => sub !== subcategory) // Deselect subcategory
      : [...selectedSubcategories, subcategory]; // Add new subcategory
    setSelectedSubcategories(updatedSubcategories);
    console.log("subcategories last :", subcategories);
    console.log("updated_subcategories :", updatedSubcategories);


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

      console.log("matches_category :", matchesCategory);
      console.log("matches_subcategory :", matchesSubcategories)
      return matchesCategory && matchesSubcategories;
    });

    console.log("filterd :", filtered);
    setFilteredProducts(filtered);
  };


  const resetFilters = () => {
    setCategories("All Products");
    setSubcategories([]);
    setSelectedSubcategories([]);
    setFilteredProducts(allProducts);
  };

  // const handleBlockButtonClick = (e, productId) => {
  //   e.stopPropagation();
  //   setCurrentProductId(productId);
  //   setIsBlockFormVisible(true);
  // };

  // const handleCloseBlockForm = () => {
  //   setIsBlockFormVisible(false);
  //   setCurrentProductId(null);
  // };

    // Update the block/unblock status in the state
    const updateBlockStatus = (productId, isBlocked) => {
      setAllProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, isBlocked } : product
        )
      );}


  // Handle block button click
  const handleBlockButtonClick = (e, productId) => {
    e.stopPropagation();
    setCurrentProductId(productId);
    setIsBlockFormVisible(true);
  };

  // Handle unblock button click
  const handleUnblockButtonClick = (e, productId) => {
    e.stopPropagation();
    setCurrentProductId(productId);
    setIsUnblockFormVisible(true);
  };

  const handleCloseBlockForm = () => {
    setIsBlockFormVisible(false);
    setCurrentProductId(null);
  };

  const handleCloseUnblockForm = () => {
    setIsUnblockFormVisible(false);
    setCurrentProductId(null);
  };


  return (
    <>
      <div className="flex mt-20 flex-wrap p-6">
        <aside className="w-full md:w-1/4 bg-white p-4 border-r-[1px] border-gray ">
          <div className="mb-6">
            <h3 className="capitalize tracking-widest text-md md:text-lg ">Browse By</h3>
            <ul className="space-y-2 mt-2">
              {["All Products", "Clothing", "Shoes", "Accessories", "Jewellery", "Eyewear", "Watches", "Wallets"].map((category) => (
                <li
                  key={category}
                  className={`cursor-pointer ${categories === category ? "text-orange-400" : "text-gray-700"
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
                        className={`${selectedSubcategories.includes(subcategory)
                          ? "text-blue-600"
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
            className="w-full bg-white border-[1px] border-gray-500 font-medium text-black  hover:text-white transition-all hover:-translate-y-0.5 hover:bg-black  py-[10px] tracking-wide  mt-4"
            onClick={resetFilters}
          >
            Clear Filters
          </button>
        </aside>



        <div className="main-grid-container w-full relative md:w-3/4  flex flex-col gap-4 items-center  justify-center">
          <div className="newin-text w-11/12 my-4 text-center">
            <span className="text-3xl font-semibold text-gray-800 lg:text-xl">
              {categories}
            </span>
          </div>
          <div className="newin-section grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  justify-center items-center  gap-4  w-11/12">
            {filteredProducts.map((product) => (
              <div
                className="product-card"
                onClick={() => {
                  navigate(`/singleproduct/${product._id}`);
                }}
              >
                <div className="product-image">
                  {product.product_images?.length > 0 ? (
                    <img
                      src={`http://localhost:3003/${product.product_images[0]}`}
                      alt="Product Image"
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>

                <div className="product-details h-36">
                  <h3
                    className="product-name cursor-pointer"
                    onClick={() => handleProductCardClick(product._id)}
                  >
                    {product.name.slice(0, 35)}...
                  </h3>
                  <span className="line-through text-xs">{product.mrp}</span>
                  <p className="font-mono text-orange-500">₹{product.price}</p>
                </div>

                <div className="product-actions">
                  <button className="font-mono border  "> stock :{product.stock}</button>
                  {product.isBlocked ? (
                    <button
                      onClick={(e) => handleUnblockButtonClick(e, product._id)}
                      className="w-full bg-gray-500 text-white text-md tracking-wide"
                    >
                      Unblock Item
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleBlockButtonClick(e, product._id)}
                      className="w-full bg-red-500 text-white text-md tracking-wide"
                    >
                      Block Item
                    </button>
                  )}
                </div>
              </div>
            ))}


            {filteredProducts.length === 0 &&
              <div className="no-data w-[90%]  flex justify-center items-center absolute top-0">
                <img src="images/9170826.jpg" className="w-[55%]" alt="" />
                <h3 className="absolute top-10 text-xs tracking-wide text-gray-500">! No products found for current filter</h3>
              </div>
            }
          </div>
        </div>
      </div>

      {/* {isBlockFormVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <BlockProductForm productId={currentProductId} onClose={handleCloseBlockForm} />
          </div>
        </div>
      )} */}

      {isBlockFormVisible && currentProductId && (
        <BlockProductForm
          productId={currentProductId}
          onClose={handleCloseBlockForm}
          onBlockSuccess={updateBlockStatus}
        />
      )}

      {isUnblockFormVisible && currentProductId && (
        <UnblockProductForm
          productId={currentProductId}
          onClose={handleCloseUnblockForm}
          onUnblockSuccess={updateBlockStatus}
        />
      )}
    </>
  );
};

export default AllProducts;
