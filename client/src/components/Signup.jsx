import React from "react";
import { useState} from "react";
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

function Signup() {

    const navigate = useNavigate()

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        user_type: "user",
    });

    const [error, setError] = useState({
        name_error: "",
        email_error: "",
        password_error: "",
        confirmpassword_err: ""
    });

    const handlechange = (e) => {
        const { name, value } = e.target;
        setData((prevdata) => ({ ...prevdata, [name]: value }));
        validate(name, value);
    }

    function validate(field, value) {
        let message = "";
        const nameReg = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
        const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passrReg = /^.{6,}$/;


        if (field === 'name') {

            if (!value) {
                message = "name is required!"
            }
            else if (!nameReg.test(value)) {
                message = "invalid name format!"

            }
            setError((prev) => ({ ...prev, name_error: message }));
            return;
        }
        else if (field === 'email') {
            if (!value) {
                message = 'email is required!'
            }
            else if (!emailReg.test(value)) {
                message = 'invalid email format!'

            }
            setError((prev) => ({ ...prev, email_error: message }));
            return;
        }
        else if (field === 'password') {
            if (!value) {
                message = 'password is required!'
            }
            else if (!passrReg.test(value)) {
                message = 'password must contain atleast 6 characters'

            }
            setError((prev) => ({ ...prev, password_error: message }));
            return;
        }
        else if (field === "confirmpassword") {
            if (data.password !== value) {
                message = "passwords doesn't match!";
            }
            setError((prev) => ({ ...prev, confirmpassword_err: message }));
            return;
        }
    }

    const signup = async (e) => {
        e.preventDefault();

        if (error.name_error || error.email_error || error.password_error || error.confirmpassword_err) {
            return;
        }
        else if (!data.name || !data.email || !data.password) {
            alert("please fill all fields before submitting")
            return;
        }
        console.log("no errors");



        try {
            let response = await axios({
                url: "http://localhost:3000/signup",
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                data
            })

            console.log("response :", response);
            let message = response.data.message;
            console.log("message : ", message);
            alert(message);
            
            localStorage.setItem("email",data.email);
            navigate("/otp")

        }
        catch (error) {
            if (error.response) {
                let response = error.response;
                console.log("response :", response);
                let message = response.data.message;
                alert(message);
            }
            else {
                console.log("error:", error);
            }
        }

    }

    return (
        <>
                <div className="signup-container">
                    <div className="form-container">
                        <form onSubmit={signup}>
                            <div>
                                <span className="login-txt">
                                    Register
                                </span>
                            </div>
                            {/* <div className="form-row">
                             <span>Do you have an account? <a href="">Login</a></span>
                        </div> */}
                            <div className="form-row">
                                <input type="text" name="name" id="name" onChange={handlechange} placeholder="Name" />
                                <span className="clienterr" id="name-err" >{error.name_error}</span>
                            </div>
                            <div className="form-row">
                                <input type="email" name="email" onChange={handlechange} id="email" placeholder="Email" />
                                <span className="clienterr" id="email-err" >{error.email_error}</span>
                            </div>
                            <div className="form-row">
                                <input type="password" name="password" onChange={handlechange} id="password" placeholder="password" />
                                <span className="clienterr" id="pass-err" >{error.password_error}</span>
                            </div>
                            <div className="form-row">
                                <input type="password" name="confirmpassword" onChange={handlechange} id="confirmpassword" placeholder="confirm password" />
                                <span className="clienterr" id="pass-err" >{error.confirmpassword_err}</span>
                            </div>

                            <div className="usertype-container">
                                <span><label htmlFor="ut">Select user type</label></span>
                                <span>
                                    <select name="user_type" id="ut">
                                        <option value="user">User</option>
                                        <option value="seller">Seller</option>
                                    </select>
                                </span>

                            </div>

                            <div className="login-btn">
                                <button id="signup" type="submit">
                                    <ion-icon name="person-add" />
                                    SignUp
                                </button>
                            </div>
                        </form>
                        <div className="img-section">
                            <div className="bgdark"></div>
                            <span className="menx-signup">
                                MENX
                            </span>
                            <span className="continue"> signup to continue ..</span>
                        </div>
                    </div>
                </div>
            

        </>
    )
}
export default Signup;
