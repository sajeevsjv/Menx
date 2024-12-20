import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Carousel from "./Carousel";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { toast } from "react-toastify";
import axios from "axios";




function UserHome() {

    const [visibleSellerControls, setVisibleSellerControls] = useState(false);
    const [newProducts, setNewProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistStatus, setWishlistStatus] = useState(false);
    const { searchContent } = useContext(DataContext);
    console.log("searchContent :", searchContent);



    useEffect(() => {
        const loadNewProducts = async () => {
            const authToken = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:3003/newproducts", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setNewProducts(response.data.data);
                console.log("new in response :", response);
            } catch (error) {
                console.error("Error fetching products:", error.response || error);
            }
        };
        loadNewProducts();

    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            const authToken = localStorage.getItem("authToken");
            try {
                const response = await axios.get("http://localhost:3003/getallproducts", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setAllProducts(response.data.data);
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
                let wishlist = data.wishlist.map(item => item.product);
                console.log("wishlist :", wishlist);
                setWishlistItems(wishlist);

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
            // toast.success(message,{
            //   autoClose: 2000,
            //   position: "top-center"
            // });
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

    const addToWishlist = async (e, id) => {
        e.stopPropagation();

        const user_id = localStorage.getItem("user_id");
        const product_id = id;
        const authToken = localStorage.getItem("authToken");

        if (!user_id || !authToken) {
            toast.error("Please login to continue.");
            return;
        }

        // Calculate the new wishlist status
        const currentStatus = !wishlistStatus;
        setWishlistStatus(currentStatus); // Update the state with the new status

        if (currentStatus) {
            // Add to wishlist
            try {
                let response = await axios({
                    method: "POST",
                    url: "http://localhost:3003/addtowishlist",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                    data: {
                        user_id,
                        product_id,
                    },
                });

                console.log("response:", response);
                let message = response.data.message;
                toast.success(message);
                setWishlistItems((prevCartItems) => [...prevCartItems, id]); // Add the product ID to the wishlist
            } catch (error) {
                if (error.response) {
                    let message = error.response.data.message;
                    toast.error(message);
                }
                console.error("Error:", error);
            }
        } else {
            // Remove from wishlist
            try {
                let response = await axios({
                    method: "DELETE",
                    url: `http://localhost:3003/removefromwishlist/${id}`,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    },
                });

                console.log("response:", response);
                let message = response.data.message;
                toast.success(message);
                setWishlistItems((prevCartItems) =>
                    prevCartItems.filter((item) => item !== id)
                ); // Remove the product ID from the wishlist
            } catch (error) {
                if (error.response) {
                    let message = error.response.data.message;
                    toast.error(message);
                }
                console.error("Error:", error);
            }
        }
    };


    // Filter products dynamically based on search input
    useEffect(() => {
        if (searchContent?.trim()) {
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


    return (
        <>
            <UserNavbar />
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


            <div className="small-banner text-md ">
                <p>
                    Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
                </p>
            </div>

            <div className="navbar-container">
                <div className="main-ad">
                    <div className="bgimage">
                        <img src="./images/nobgimgcropped.png" alt="" />
                        <div className="ad1 absolute top-[10%] md:top-[6%] w-[100%] md:w-[46%] ">
                            <Carousel />
                        </div>


                        <div className="ad2 hidden md:block absolute top-[10%] md:top-[6%]  w-[40%] left-[60%] -z-50">
                            <img src="./images/mayagi_fashion_pgotograpghy_of_a_25_yo_queer_man_standing_again_e15ef361-7698-4369-9eb9-13.webp" alt="" />
                        </div>
                        {/* <div className="sliding-text w-full z-10 absolute top-[40%]">
                            <marquee behavior="scroll" width="100%" height="100px" direction="left">Get 50% Off</marquee>
                            </div> */}
                        <div className="slogan uppercase">
                            <span className="text-xs  md:text-lg">
                                Timeless Style, Modern Fit
                            </span>
                        </div>
                        <div className="banner top-[50%] hidden   md:block">
                            <div className="main-grid-container mb-8 pb-10 pt-2 bg-[#cc7f3c] w-full flex flex-col items-center  justify-center">
                                <div className="newin-text w-11/12 my-4">
                                    <span className="text-2xl newin text-white">
                                        NEW IN
                                    </span>
                                </div>
                                <div className="newin-section grid grid-flow-col overflow-x-scroll auto-cols-[95%] sm:auto-cols-[80%]  lg:auto-cols-[30%]   gap-4 w-11/12">
                                    {newProducts?.length > 0 ? newProducts.map((product) => (
                                        <div className="product-card" key={product._id}>
                                            <div className="product-image">
                                                <img src={`http://localhost:3003/${product.product_images[0]}`} alt="Product Image" />
                                                <button onClick={(e) => addToWishlist(e, product._id)} className={`${wishlistItems.includes(product._id) ? "wishlist-btn" : "wishlist-btn1"} `}>
                                                    ❤
                                                </button>
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">
                                                    {product.name.slice(0, 30)}...
                                                </h3>
                                                <p className="product-price">
                                                    {product.price}
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
                                    )) :
                                        (
                                            <h4>Loading data...</h4>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-md top-[50%] block   md:hidden">
                <div className="main-grid-container mb-8 pb-10 pt-2 bg-[#cc7f3c] w-full flex flex-col items-center  justify-center">
                    <div className="newin-text w-11/12 my-4">
                        <span className="text-lg md:text-2xl  newin text-white">
                            NEW IN
                        </span>
                    </div>
                    <div className="newin-section grid grid-flow-col overflow-x-scroll auto-cols-[95%] sm:auto-cols-[80%]  lg:auto-cols-[30%]   gap-4 w-11/12">
                        {newProducts?.length > 0 ? newProducts.map((product) => (
                            <div className="product-card" key={product._id}>
                                <div className="product-image">
                                    <img src={`http://localhost:3003/${product.product_images[0]}`} alt="Product Image" />
                                    <button className="wishlist-btn">
                                        ❤
                                    </button>
                                </div>
                                <div className="product-details">
                                    <h3 className="product-name">
                                        {product.name.slice(0, 30)}...
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
                        )) :
                            (
                                <h4>Loading data...</h4>
                            )}
                    </div>
                </div>
            </div>


        </>
    )
}
export default UserHome;