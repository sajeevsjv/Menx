import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Carousel from "./Carousel";



function UserHome() {
    
    return (
        <>
            <UserNavbar />
            <div className="small-banner text-md ">
                <p>
                    Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
                </p>
            </div>

            <div className="navbar-container">

                <div className="main-ad">
                    <div className="bgimage">
                        <img src="./images/nobgimg.png" alt="" />
                            <div className="ad1 absolute top-[5%] w-[100%] md:w-[46%] ">
                                <Carousel />
                            </div>
                            
                        
                        <div className="ad2 hidden md:block absolute top-[5%] w-[40%] left-[60%] -z-50">
                                <img src="./images/mayagi_fashion_pgotograpghy_of_a_25_yo_queer_man_standing_again_e15ef361-7698-4369-9eb9-13.webp" alt="" />
                            </div>
                            {/* <div className="sliding-text w-full z-10 absolute top-[40%]">
                            <marquee behavior="scroll" width="100%" height="100px" direction="left">Get 50% Off</marquee>
                            </div> */}
                        <div className="slogan uppercase">
                            <span className="text-xs  md:text-xl">
                                Timeless Style, Modern Fit
                            </span>
                        </div>
                        <div className="banner top-[44%] hidden   md:block">
                            <img src="./images/freepik-export-20241118061906wRTB.jpeg" alt="" />
                            <div className="banner-text hidden">
                                <span>
                                    Signatures Wool Mix Coat camel
                                </span>
                                <span>
                                    <button className="primary-btn hover:bg-fuchsia-500">
                                        Shop now
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-md top-[50%] block   md:hidden">
                            <img src="./images/freepik-export-20241118061906wRTB.jpeg" alt="" />
                            <div className="banner-text hidden">
                                <span>
                                    Signatures Wool Mix Coat camel
                                </span>
                                <span>
                                    <button className="primary-btn hover:bg-fuchsia-500">
                                        Shop now
                                    </button>
                                </span>
                            </div>
                        </div>
            <div className="main-grid-container mb-8 pb-10 pt-2 bg-[#cc7f3c] w-full flex flex-col items-center  justify-center">
                <div className="newin-text w-11/12 my-4">
                    <span className="text-2xl newin text-white">
                        NEW IN
                    </span>
                </div>
                <div className="newin-section grid grid-flow-col overflow-x-scroll  auto-cols-[30%]  gap-4 w-11/12">
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