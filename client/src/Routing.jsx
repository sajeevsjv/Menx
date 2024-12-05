import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
function Routing(){
    return(
        <>
        <Router>
            <Routes>
            <Route path={"/"} element={<UserHome />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/usernavbar"} element={<UserNavbar/>} />
            <Route path={"/login"} element= {<Login />} />
            <Route path={"/userhome"} element={<UserHome />} />
            <Route path={"/sellerhome"} element={<SellerHome />} />
            <Route path={"/sellernavbar"} element={<SellerNavbar />}/>
            <Route path={"/addproduct"} element={< AddProduct />} />
            <Route path={"/categories"} element={< CategorySelector />} />
            <Route path={"/shop"} element={<Shop />} />
            <Route path={"/productpage/:id"} element={<ProductPage />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;