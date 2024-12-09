import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


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

const Shop = () => {
  const [categories, setCategories] = useState("All Products");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

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

  }, []);

  useEffect(() => {
    const loadCart = async () => {
      console.log("loadcart executed")
      const user_id = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("authToken");
      try {
        let response = await axios({
          method: "GET",
          url: `http://localhost:3003/getsingleuser/${user_id}`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })

        console.log("response from 2nd useeefect :", response);
        let data = response.data.data;
        console.log("response data :", data);
        let cart = data.cart.map(item => item.product._id);
        setCartItems(cart);

      }
      catch (error) {
        if (error.response) {
          console.log("eror response :", error.response);
        }
        console.log("error :", error);
      }
    };

    loadCart();
  }, [])

  console.log("allproducts", allProducts);

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

  const handleProductCardClick = (id) => {
    navigate(`/productpage/${id}`)
  }

  const addToCart = async (id) => {
    const user_id = localStorage.getItem("user_id");
    const product_id = id;
    const authToken = localStorage.getItem("authToken");
    if (!user_id || !authToken) {
      toast.error("Please login to continue.");
      return;
    }
  

    try {
      let response = await axios({
        method: "POST",
        url: "http://localhost:3003/addtocart",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        data: {
          user_id,
          product_id
        }
      });

      console.log("response :", response);
      let message = response.data.message;
      toast.success(message);
      setCartItems((prevCartItems) => [...prevCartItems, id]); // Add the product id to the cart state


    }
    catch (error) {
      if (error.response) {
        let message = error.response.data.message;
        toast.error(message);
      }
      console.log("error :", error);
    }

  }

  console.log("cartItems :", cartItems);

  return (
    <>
      <UserNavbar />
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
            <span className="text-lg capitalize font-semibold lg:text-xl  text-gray-950 tracking-[3px] ">
              {categories}
            </span>
          </div>
          <div className="newin-section grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  justify-center items-center  gap-4  w-11/12">
            {filteredProducts.map((product) => (
              <div className="product-card">
                <div className="product-image" onClick={() => handleProductCardClick(product._id)}>
                  {product.product_images?.length > 0 ? (
                    <img
                      src={`http://localhost:3003/${product.product_images[0]}`}
                      alt="Product Image"
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                  <button className="wishlist-btn">
                    ❤
                  </button>
                </div>

                <div className="product-details h-32">
                  <h3 className="product-name cursor-pointer" onClick={() => handleProductCardClick(product._id)} >
                    {product.name.slice(0, 35)}...
                  </h3>
                  <p className="product-price">
                    ${product.price}
                  </p>
                </div>
                <div className="product-actions">
                  {cartItems.length > 0 && cartItems.includes(product._id) ? (
                    <button className="bg-orange-400 rounded-sm text-white p-3 flex justify-center gap-1">
                      <ion-icon name="checkbox"></ion-icon> Added to Cart
                    </button>
                  ) : (
                    <button
                      className="add-to-cart flex justify-center gap-1"
                      onClick={() => addToCart(product._id)}
                    >
                      <ion-icon name="cart"></ion-icon> Add to Cart
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
    </>
  );
};

export default Shop;
