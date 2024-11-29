import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function Routing(){
    return(
        <>
        <Router>
            <Routes>
            <Route path={"/"} element={<Signup />} />
            <Route path={"/login"} element= {<Login />} />
            <Route path={"/home"} element={<Home />} />
            <Route path={"/navbar"}  element={<Navbar />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;