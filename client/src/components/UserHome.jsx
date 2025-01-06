import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Carousel from "./Carousel";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { toast } from "react-toastify";
import axios from "axios";
import Footer from "./Footer";
import Contactpage from "./Contact"



function UserHome() {

    const navigate = useNavigate();
    const [visibleSellerControls, setVisibleSellerControls] = useState(false);
    const [newProducts, setNewProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistStatus, setWishlistStatus] = useState(false);
    const { searchContent } = useContext(DataContext);
    console.log("searchContent :", searchContent);



    useEffect(() => {
        const loadNewProducts = async () => {
            const authToken = localStorage.getItem("authToken");
            let user_id = localStorage.getItem("user_id");
    
            // Use guest_userId if user_id is not present
            const guest_userId = "67757636a49d858023ab6549";
            user_id = user_id || guest_userId;
    
            try {
                const response = await axios.get(`http://localhost:3003/newproducts/${user_id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                
                });
                let  unblockedProducts  = response.data.data.filter(product => product.isBlocked == false);
                setNewProducts(unblockedProducts);
                console.log("new in response:", response);
            } catch (error) {
                console.error("Error fetching products:", error.response || error);
            }
        };
    
        loadNewProducts();
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

    const addToCart = async (e,id) => {
        e.stopPropagation();
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

        // Check if the product is already in the wishlist
        const isProductInWishlist = wishlistItems.some((item) => item._id === product_id);

        try {
            if (!isProductInWishlist) {
                // Add to wishlist
                const response = await axios.post(
                    "http://localhost:3003/addtowishlist",
                    { user_id, product_id },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                // Update wishlist state
                setWishlistItems((prev) => [...prev, { _id: product_id }]);
            } else {
                // Remove from wishlist
                const response = await axios.delete(
                    `http://localhost:3003/removefromwishlist/${product_id}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );

                // Update wishlist state
                setWishlistItems((prev) => prev.filter((item) => item._id !== product_id));
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };



    return (
        <>
            <UserNavbar />


            <div className="small-banner text-md  mt-14 ">
                <p>
                    Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
                </p>
            </div>

            <div className="navbar-container mb-64">
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
                            <div className="main-grid-container mb-8 pb-10 pt-2 bg-gradient-to-r from-[#cc7f3c] to-[#CF9663] w-full flex flex-col items-center  justify-center">
                                <div className="newin-text w-11/12 my-4">
                                    <span className="text-2xl newin text-white">
                                        NEW IN
                                    </span>
                                </div>
                                <div className="newin-section grid grid-flow-col overflow-x-scroll auto-cols-[95%] sm:auto-cols-[80%]  lg:auto-cols-[30%]   gap-4 w-11/12">
                                    {newProducts?.length > 0 ? newProducts.map((product) => (
                                        <div className="product-card cursor-pointer" onClick={()=>{ navigate(`/productpage/${product._id}`)}} key={product._id}>
                                            <div className="product-image">
                                                <img src={`http://localhost:3003/${product.product_images[0]}`} alt="Product Image" />
                                                <button onClick={(e) => addToWishlist(e, product._id)} className={`${wishlistItems.some((item) => item._id === product._id)
                                                    ? "wishlist-btn" : "wishlist-btn1"} `}>
                                                    ❤
                                                </button>
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">
                                                    {product.name.slice(0, 30)}...
                                                </h3>
                                                <p className="text-orange-500 font-mono">
                                                ₹{product.price}
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
                                                        onClick={(e) => addToCart(e,product._id)}
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
                            <div className="product-card cursor-pointer" onClick={()=>{ navigate(`/productpage/${product._id}`)}} key={product._id}>
                                <div className="product-image">
                                    <img src={`http://localhost:3003/${product.product_images[0]}`} alt="Product Image" />
                                    <button onClick={(e) => addToWishlist(e, product._id)} className={`${wishlistItems.some((item) => item._id === product._id)
                                        ? "wishlist-btn" : "wishlist-btn1"} `}>
                                        ❤
                                    </button>
                                </div>
                                <div className="product-details">
                                    <h3 className="product-name">
                                        {product.name.slice(0, 30)}...
                                    </h3>
                                    <p className="product-price font-mono">
                                    ₹{product.price}
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

            <div className="offer relative w-full h-1/2">
                <img className="w-full z-10" src="./images/freepik__expand__60200.png" alt="offer-ad" />
                <div className="contact-container mb-20">
                    <Contactpage />
                </div>


            </div>
            <Footer />
        </>
    )
}
export default UserHome;