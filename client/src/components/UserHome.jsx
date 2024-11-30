import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function UserHome() {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const handleProfileMenuClick = () => {
        setProfileMenu(true);
    }

    return (
        <>
            <div className="small-banner" style={{ 'fontSize': '30px' }}>
                <p>
                    Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
                </p>
            </div>
            <nav className="topnav fixed xs:hidden m-1 mt-0 w-full z-10 top-0 px-10">

                <div className=" hidden nav-left p-3  md:flex md:gap-2">
                    <a href="">
                        Home
                    </a>
                    <a href="">
                        Shop
                    </a>
                    <a href="">
                        Products
                    </a>
                    <a href="">
                        Contact
                    </a>
                </div>
                <div className="nav nav-center">
                    <span className="logo-name">
                        MeNX.
                    </span>
                </div>
                <div className="nav nav-right">
                    <input type="text" name="search" placeholder="search.." />
                    <ion-icon name="heart-outline" />
                    <ion-icon name="bag-outline" />
                    <Menu as="div" className="relative ml-3">
                        <div>
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <img
                                    alt=""
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    className="size-8 rounded-full"
                                />
                            </MenuButton>
                        </div>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <MenuItem>
                                <a
                                    href="" onClick={() => { navigate("/login") }}
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                >
                                    Your Profile
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                >
                                    Settings
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                >
                                    Sign out
                                </a>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>

                {/* <div className="absolute top-12 right-0 z-10  w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">
                        Your Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-1">
                        Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">
                        Sign out
                    </a>
                </div> */}

            </nav>
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
                <div className="newin-section grid grid-cols-1 md:grid-cols-2  gap-4  w-11/12">
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