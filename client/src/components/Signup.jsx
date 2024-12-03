import React from "react";
import { useState} from "react";
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import Nav from "./nav";

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
                url: "http://localhost:3003/signup",
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
            
            navigate("/login")

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
          <Nav />
          <div className="signup-bgimg absolute top-0 -z-10 w-full">
              <img src="images\Hero.webp" alt="" className="w-full" />
          </div>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
           
    
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="#" method="POST" className="space-y-3 p-6  rounded-md backdrop-blur-lg border-2 " onSubmit={signup}>
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="name"
                      required
                      autoComplete="name"
                      onChange={handlechange}
                      
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-gray-400 focus:outline-none tracking-wide text-md sm:text-sm/6"
                    />
                    <span className="text-sm/4 text-red-500 tracking-wider">{error.name_error}</span>
                  </div>
                </div>
  
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      onChange={handlechange}
                      
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-gray-400 focus:outline-none tracking-wide text-md sm:text-sm/6"
                    />
                  <span className="text-sm/4 text-red-500 tracking-wider">{error.email_error}</span>
  
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      onChange={handlechange}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-gray-400  focus:outline-none text-md tracking-wide  sm:text-sm/6"
                    />
                  <span className="text-sm/4 text-red-500 tracking-wider">{error.password_error}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Confirm Password
                    </label>
                  </div>
  
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      onChange={handlechange}
                      className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-gray-400  focus:outline-none text-md tracking-wide  sm:text-sm/6"
                    />
                    <span className="text-sm/4 text-red-500 tracking-wider">{error.confirmpassword_error}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Select usertype
                  </label>
                  <div className="mt-1">
                    <select name="user_type" onChange={handlechange} id="" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-orange-300 placeholder:text-gray-400  focus:outline-none text-md tracking-wide  sm:text-sm/6">
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                    </select>
                  <span className="text-sm/4 text-red-500 tracking-wider">{error.email_error}</span>
  
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-orange-600 p-2.5  text-lg font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </button>
                </div>
              </form>
    
              
            </div>
          </div>
        </>
      )
}
export default Signup;
