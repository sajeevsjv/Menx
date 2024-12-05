import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";



function UserHome() {
    const navigate = useNavigate();

    

    return (
        <>
          <UserNavbar />
            <div className="small-banner " style={{ 'fontSize': '30px' }}>
                <p>
                    Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
                </p>
            </div>
            
            <div className="navbar-container">

                <div className="main-ad">
                    <div className="bgimage">
                        <img src="./images/nobgimg.png" alt="" />
                        <div className="ads-container">
                            <div className="ad ad1">
                                <img src="./images/mayagi_fashion_pgotograpghy_of_a_25_yo_queer_man_standing_again_e15ef361-7698-4369-9eb9-13.webp" alt="" />
                            </div>
                            <div className="ad ad2">
                                <img src="./images/mayagi_fashion_pgotograpghy_of_a_25_yo_queer_man_standing_again_e15ef361-7698-4369-9eb9-13.webp" alt="" />
                            </div>
                        </div>
                        <div className="slogan">
                            <span>
                                EVERYDAY APPAREL FOR EVERYONE
                            </span>
                        </div>
                        <div className="banner">
                            <img src="./images/freepik-export-20241118061906wRTB.jpeg" alt="" />
                            <div className="banner-text hidden">
                                <span>
                                    Signatures Wool Mix Coat camel
                                </span>
                                <span>
                                    <button className="primary-btn">
                                        Shop now
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-grid-container w-full flex flex-col items-center  justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-xl newin">
                        NEW IN
                    </span>
                </div>
                <div className="newin-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center  gap-4  w-11/12">
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fda%2Fea%2Fdaea0e239cfb458343f87a8b8ff0e9d2a4c4c25e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVEDETAIL%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Slim Fit Easy-iron shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1 ">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1 ">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div className="product-card">
                        <div className="product-image">
                            <img src="https://m.media-amazon.com/images/I/61GtS6IrR7L._SX569_.jpg" alt="Product Image" />
                            <button className="wishlist-btn">
                                ❤
                            </button>
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">
                                Stylish Shirt
                            </h3>
                            <p className="product-price">
                                $49.99
                            </p>
                        </div>
                        <div className="product-actions">
                            <button className="add-to-cart flex justify-center gap-1">
                                <ion-icon name="cart"></ion-icon> Add to Cart
                            </button>
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
}
export default UserHome;