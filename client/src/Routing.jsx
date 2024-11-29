import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Nav from "./components/nav";
function Routing(){
    return(
        <>
        <Router>
            <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/login"} element= {<Login />} />
            <Route path={"/home"} element={<Home />} />
            <Route path={"/navbar"}  element={<Navbar />} />
            <Route path={"/nav"} element={<Nav />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;