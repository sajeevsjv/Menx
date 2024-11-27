import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import OtpVerification from "./components/OtpVerification";

function Routing(){
    return(
        <>
        <Router>
            <Routes>
            <Route path={"/"} element={<Signup />} />
            <Route path={"otp"} element={<OtpVerification />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;