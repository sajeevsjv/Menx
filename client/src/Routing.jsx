import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import UserHome from "./components/UserHome";
import Navbar from "./components/Navbar";
import Nav from "./components/nav";
import AddProduct from "./components/AddProduct";
import SellerHome from "./components/SellerHome";
function Routing(){
    return(
        <>
        <Router>
            <Routes>
            <Route path={"/"} element={<UserHome />} />
            <Route path={"/login"} element= {<Login />} />
            <Route path={"/userhome"} element={<UserHome />} />
            <Route path={"/sellerhome"} element={<SellerHome />} />
            <Route path={"/navbar"}  element={<Navbar />} />
            <Route path={"/nav"} element={<Nav />} />
            <Route path={"/addproduct"} element={< AddProduct />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;