import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useEffect } from "react";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { useCallback } from "react";

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState("");
  const [visibleSellerControls, setVisibleSellerControls] = useState(false);
 

  const toggleOffcanvas = () => {
    setIsOpen(!isOpen);
  };

  const { userData, setUserData, searchContent, setSearchContent } = useContext(DataContext);

  function toggleshippingform() {
    setShowShippingForm(!showShippingForm);
  }

  useEffect(() => {
    const seller_user_type = "67472a23659bfab478d1ef7d"
    const user_type = localStorage.getItem("user_type");
    if (user_type === seller_user_type) {
      setVisibleSellerControls(true);
    }
  }, [])

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const loadUser = async () => {
        axios({
          url: `http://localhost:3003/getsingleuser/${user_id}`,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })
          .then((response) => {
            console.log("response :", response);
            const userdata = response.data.data;
            setUserData(userdata);
          })
          .catch((error) => {
            if (error.response) {
              console.log("error response :", error.response);
            }
            else {
              console.log("error :", error);
            }
          })
      }
      loadUser();
    }

  }, [])

  useEffect(() => {
    const loadProducts = async () => {
        const authToken = localStorage.getItem("authToken");
        const user_id = localStorage.getItem("user_id");

        try {
            const response = await axios.get(`http://localhost:3003/getallproducts/${user_id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setAllProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error.response || error);
        }
    };
    loadProducts();

}, []);

 // Filter products dynamically based on search input
 useEffect(() => {
  if (searchContent?.trim()) {
      console.log("allproducts :",allProducts);
      const lowerCaseSearch = searchContent.trim().toLowerCase(); // Normalize search input
      const filtered = allProducts.filter((product) => {
          const name = product.name?.toLowerCase() || ""; // Safeguard for product.name
          const categories = Array.isArray(product.categories)
              ? product.categories.map((cat) => cat.toLowerCase()) // Ensure all categories are lowercase
              : []; // Fallback if categories is not an array
          return (
              name.includes(lowerCaseSearch) ||
              categories.some((cat) => cat.includes(lowerCaseSearch)) // Check for a match in categories array
          );
      });
      setFilteredProducts(filtered);
  } else {
      setFilteredProducts(allProducts); // Reset to all products when search is empty
  }
}, [searchContent, allProducts]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu on mobile when a link is clicked
  };

  const handleChange = useCallback((e) => {
    e.preventDefault();
    let searchdata = e.target.value; // Capture the input value
    setSearchContent(searchdata); // Update state
  }, []); 

  return (
    <>
      <nav className=" text-black bg-white border-b-[1px] p-2 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
          <div className="flex items-center justify-between h-9">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="block lg:hidden text-black focus:outline-none w-[45%]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Nav Links Dropdown for Mobile */}
            <div
              className={`absolute top-16 left-0 w-full flex flex-col text-sm space-y-3 bg-white p-4 z-10 border-b-2 lg:hidden
              ${menuOpen ? "animate-slide-down" : "animate-slide-up hidden"}
             `}
            >
              <Link to="/userhome">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/shop">Clothing</Link>
              <Link to="/shop">Shoes</Link>
              <Link to="">Contact</Link>
              {visibleSellerControls && <Link to="/myshop">MyShop</Link>}
            </div>


            {/* Nav Links for Desktop */}
            <div className="hidden lg:flex gap-2 w-[45%] text-sm tracking-wider">

              <Link to="/userhome">Home</Link>
              <Link to="/shop" >Shop</Link>
              <Link to="">Contact</Link>
              {visibleSellerControls &&
                <Link to="/myshop">MyShop</Link>
              }



            </div>

            {/* Center Text Logo */}
            <div className="text-2xl uppercase tracking-[3px] font-[Lato] font-medium">
              <a href="#">Menx.</a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4 justify-end w-[45%]">
              {/* Search Field */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Search"
                  className=" pl-3 pr-10 py-1 border-2 text-black focus:outline-none"
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="absolute  h-9 top-0 right-0 px-3 py-1 bg-[rgb(255,177,109)] hover:bg-black hover:text-white"
                >
                  Go
                </button>
              </div>
              {visibleSellerControls &&
                <button onClick={()=>navigate("/addproduct")} className="bg-orange-400 px-4 text-sm rounded-full text-white hover:bg-black py-[4px]">+ Add product</button>
              }
              <ion-icon name="heart-outline" onClick={()=>navigate('/wishlist')}  />
              <ion-icon name="bag-outline" onClick={() => navigate("/cart")} />


              {/* Profile Dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5"/>
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-7 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {localStorage.getItem("authToken") ?
                    (
                      <>

                        <MenuItem>
                          <span
                            onClick={toggleOffcanvas}
                            className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:text-orange-300 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          >
                            My Profile
                          </span>
                        </MenuItem>
                        <MenuItem>
                          <span
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-300 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                            onClick={handleSignOut}

                          >
                            <Link to={"/userhome"} onClick={handleSignOut}>Sign Out</Link>
                          </span>
                        </MenuItem>
                      </>
                    )
                    :
                    (
                      <>
                        <MenuItem>
                          <span

                            className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-300 data-[focus]:bg-gray-100 data-[focus]:outline-none"

                          >
                            <Link to={"/login"}>Sign In</Link>
                          </span>
                        </MenuItem>
                        <MenuItem>
                          <span

                            className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-300 data-[focus]:bg-gray-100 data-[focus]:outline-none"

                          >
                            <Link to={"/signup"}>Sign Up</Link>
                          </span>
                        </MenuItem>
                      </>
                    )
                  }
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
      

      {searchContent && (
                <div className="mt-32 grid grid-cols-3 items-center m-auto overflow-x-scroll auto-cols-[95%] sm:auto-cols-[80%] lg:auto-cols-[30%] gap-5 w-11/12">
                    {filteredProducts?.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image relative">
                                    <img
                                        src={`http://localhost:3003/${product.product_images[0]}`}
                                        alt={product.name || "Product Image"}
                                        className="w-full h-60 object-cover rounded-md"
                                    />
                                    <button className="wishlist-btn  absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                                        ❤
                                    </button>
                                </div>
                                <div className="product-details p-2">
                                    <h3 className="product-name text-lg font-semibold truncate">{product.name}</h3>
                                    <p className="product-price text-gray-600 mt-1"> ${product.price}</p>
                                </div>
                                <div className="product-actions mt-2">
                                    <button className="add-to-cart flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
                                        <ion-icon name="cart"></ion-icon> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-3 text-center flex justify-center items-center gap-1 mb-8 text-gray-500"><ion-icon name="alert-circle-outline"></ion-icon> No products found.</p>
                    )}
                </div>
            )}


      {/* Offcanvas Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[1/2] lg:w-1/4 bg-white text-black transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } shadow-lg z-50`}
      >
        <div className="p-3 bg-[#dbb485] rounded-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaUserCircle className="text-gray-500 text-4xl" />
              {userData ?
                <div className="ml-3">
                  <h2 className="text-lg text-white">{userData.name}</h2>
                  <p className="text-sm tracking-wider  text-white">{userData.email}</p>
                </div>
                : <h3>loading...</h3>
              }
            </div>
            <div className="closebtn text-2xl"><button onClick={toggleOffcanvas}><ion-icon className="text-3xl" name="close-outline"></ion-icon></button></div>
          </div>
        </div>
        <ul className="p-5 space-y-6">
          <li className="flex items-center gap-2 text-md"> <ion-icon name="cart-outline"></ion-icon><Link to={"/cart"}>Cart</Link></li>
          <li className="flex items-center gap-2 text-md"><ion-icon name="heart-outline"></ion-icon> <Link to={"/wishlist"}> Wishlist</Link></li>
          <li className="flex items-center gap-2 text-md"><ion-icon name="pricetags-outline"></ion-icon> <Link to={"/orders"}>Orders</Link></li>
          <li><div className="divider h-[1px] w-full bg-slate-200"></div></li>
          <li className="flex items-center gap-2 text-md"><ion-icon name="location-outline"></ion-icon> <Link to={"/shippingform"}>Saved Adresses</Link></li>
          {userData?.address?.length > 0
            ? userData.address.map((adr, index) => (
              <p key={index} className="text-sm ml-5">{adr.address}</p>
            ))
            :
            null}

          <button onClick={() => navigate("/shippingform")} className="px-4 py-2 ml-5 text-white text-sm tracking-wide border bg-orange-400 rounded-full flex justify-center items-center gap-1">
            <ion-icon name="add-outline"></ion-icon> Add new address
          </button>


          <li><div className="divider h-[1px] w-full bg-slate-200"></div></li>
          {!visibleSellerControls &&
            <li className="flex items-center gap-2 text-md"><ion-icon name="arrow-up-circle-outline"></ion-icon> <Link to={"/cart"}>Upgrade to Seller Account</Link></li>
          }
        </ul>
      </div>
    </>
  );
};

const handleSignOut = () => {
  localStorage.clear();
  const token = localStorage.getItem("authToken");
  setVisibleSellerControls(false);
  if (!token) {
    toast.success('succesfully loggedout');
   
    setTimeout(() => {
      navigate("/");
    }, 2000);
  } else {
    toast.error("Failed to logout");
  }
};


export default UserNavbar;


