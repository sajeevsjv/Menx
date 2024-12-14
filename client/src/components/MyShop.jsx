import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import UserNavbar from './UserNavbar';

function MyShop() {
    const [products, setProducts] = useState();
    const [lowstockproducts, setLowStockProducts] = useState("");
    const [activeTab, setActiveTab] = useState("All"); // State for active tab

    useEffect(() => {
        const loadMyProducts = async () => {
            const user_id = localStorage.getItem("user_id");
            const authToken = localStorage.getItem("authToken");
            try {
                let response = await axios({
                    method: "GET",
                    url: `http://localhost:3003/sellerproducts/${user_id}`,
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };
        loadMyProducts();
    }, []);

    useEffect(() => {
        const loadLowStockProducts = async () => {
            const user_id = localStorage.getItem("user_id");
            const authToken = localStorage.getItem("authToken");
            try {
                let response = await axios({
                    method: "GET",
                    url: `http://localhost:3003/lowstockproducts/${user_id}`,
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                setLowStockProducts(response.data.data);
            } catch (error) {
                console.error("Error loading low stock products:", error);
            }
        };
        loadLowStockProducts();
    }, []);

    return (
        <>  
            <UserNavbar />
            <div className="sellernavbar mt-24">
                <ul className="flex space-x-4 justify-center text-md font-normal border-b-[1px] pb-2 tracking-wider">
                    {["All", "Sold", "Unsold", "Earnings"].map((tab) => (
                        <li
                            key={tab}
                            className={`border-b-2 p-2 ${
                                activeTab === tab ? "border-orange-300" : "border-transparent"
                            } cursor-pointer`}
                            onClick={() => setActiveTab(tab)} // Update active tab on click
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="main-grid-container mb-8 pb-10 pt-2 w-full flex flex-col items-center justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-xl text-[red] uppercase tracking-[3px] flex items-center gap-2">
                        <ion-icon size="small" name="alert-circle-outline"></ion-icon> Low Stock
                    </span>
                </div>
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-11/12">
                    {lowstockproducts?.length > 0 ? (
                        lowstockproducts.map((product) => (
                            <div className="product-card" key={product._id}>
                                <div className="product-image">
                                    <img
                                        src={`http://localhost:3003/${product.product_images[0]}` || "https://via.placeholder.com/150"}
                                        alt={product.name || "Product Image"}
                                    />
                                    <button className="wishlist-btn">❤</button>
                                </div>
                                <div className="product-details">
                                    <h3 className="product-name">{product.name.slice(0, 30) || "Product Name"}..</h3>
                                    <p className="product-price font-[arial] font-bold">₹{product.price || "0.00"}</p>
                                    <p className="text-[green] text-lg">stock :{product.stock}</p>
                                </div>
                                <div className="product-actions">
                                    <button className="add-to-cart flex justify-center gap-1">
                                        <ion-icon name="create-outline"></ion-icon> Edit details / update stock
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h4>Loading products...</h4>
                    )}
                </div>
            </div>

            <div className="main-grid-container mb-8 pb-10 pt-2 w-full flex flex-col items-center justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-xl text-gray-400 uppercase tracking-[3px]">All products</span>
                </div>
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-11/12">
                    {products?.length > 0 ? (
                        products.map((product) => (
                            <div className="product-card" key={product._id}>
                                <div className="product-image">
                                    <img
                                        src={`http://localhost:3003/${product.product_images[0]}` || "https://via.placeholder.com/150"}
                                        alt={product.name || "Product Image"}
                                    />
                                    <button className="wishlist-btn">❤</button>
                                </div>
                                <div className="product-details">
                                    <h3 className="product-name">{product.name.slice(0, 30) || "Product Name"}..</h3>
                                    <p className="product-price font-[arial] font-bold">₹{product.price || "0.00"}</p>
                                    <p className="text-[green] text-lg">stock :{product.stock}</p>
                                </div>
                                <div className="product-actions">
                                    <button className="add-to-cart flex justify-center gap-1">
                                        <ion-icon name="create-outline"></ion-icon> Edit details / update stock
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h4>Loading products...</h4>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyShop;
