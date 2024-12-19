import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {ToastContainer } from "react-toastify";
import UserNavbar from "./components/UserNavbar";
import SellerNavbar from "./components/SellerNavbar";
import Signup from "./components/signup";
import Login from "./components/Login";
import UserHome from "./components/UserHome";
import AddProduct from "./components/AddProduct";
import SellerHome from "./components/SellerHome";
import CategorySelector from "./components/Categories";
import Shop from "./components/Shop";
import ProductPage from "./components/ProductPage";
import Cart from "./components/Cart";
import Carousel from "./components/Carousel";
import TestCarousel from "./components/TestCarousel";
import Offcanvas from "./components/Offcanvas";
import ShippingForm from "./components/ShippingForm";
import MyShop from "./components/MyShop";
import Orders from "./components/Orders";
import Dashboard from "./components/Dashboard";
function Routing(){
    return(
        <>
        <ToastContainer />
        <Router>
            <Routes>
            <Route path={"/"} element={<UserHome />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/usernavbar"} element={<UserNavbar/>} />
            <Route path={"/login"} element= {<Login />} />
            <Route path={"/userhome"} element={<UserHome />} />
            <Route path={"/sellerhome"} element={<SellerHome />} />
            <Route path={"/sellernavbar"} element={<SellerNavbar />} />
            <Route path={"/addproduct"} element={< AddProduct />} />
            <Route path={"/categories"} element={< CategorySelector />} />
            <Route path={"/shop"} element={<Shop />} />
            <Route path={"/productpage/:id"} element={<ProductPage />} />
            <Route path={"/cart"} element={<Cart />} />
            <Route path={"/carousel"} element={<Carousel />} />
            <Route path={"/testcarousel"} element={<TestCarousel />} />
            <Route path={"/offcanvas"} element={<Offcanvas />} />
            <Route path={"/shippingform"} element={<ShippingForm />} />
            <Route path={"/myshop"} element={<MyShop />} />
            <Route path={"/orders"} element={<Orders />} />
            <Route path={"/dashboard"} element={<Dashboard/>} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;