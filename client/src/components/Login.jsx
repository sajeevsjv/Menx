import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavbar from './UserNavbar';
import { useContext } from 'react';
import { DataContext } from './DataProvider';



const Login = () => {
    
     const {showLoginForm, setShowLoginForm} = useContext(DataContext);
    
    function toggleloginform(){
        setShowLoginForm(!showLoginForm);
        console.log("showloginform :",showLoginForm);
    }

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: ""
    });
    

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        // validate(name, value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("data from login :", data);

        try {
            let response = await axios({
                url: "http://localhost:3003/login",
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                data
            })

            console.log("response :", response);
            let message = response.data.message;
            console.log("message : ", message);
            toast.success(message)

            const token = response.data.data.token;
            const user_id = response.data.data.user_id;
            const user_type_fromLogin = response.data.data.user_type;
            localStorage.setItem("authToken", token);
            localStorage.setItem("user_id",user_id);
            localStorage.setItem("user_type",user_type_fromLogin);
            console.log("localStorage :", localStorage);
            const admin_userType = "67472a35659bfab478d1ef7e"
            if(user_type_fromLogin === admin_userType ){
                setTimeout(() => {
                    navigate("/dashboard")
                }, 2000); 
            }
            else{
            setTimeout(() => {
                navigate("/userhome")
            }, 2000); 
        }
           

        }
        catch (error) {
            if (error.response) {
                let response = error.response;
                console.log("response :", response);
                let message = response.data.message;
            }   
            else {
                console.log("error:", error);
            }
        }



    }

    return (
        <> 
            <div className="login-form-container m-auto w-[80%] md:w-[40%] flex justify-center">
                <form action className="form_main border-[1px] min-h-40 w-[100%]" onSubmit={handleLogin}>
                    <p className="heading">Login</p>
                    <div className="inputContainer">
                        <svg className="inputIcon" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#2e2e2e" viewBox="0 0 16 16">
                            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                        </svg>
                        <input type="email" name='email' className="inputField" id="email" placeholder="Email" onChange={handleChange} />
                    </div>
                    {/* <div className='text-left w-100 z-10 '><span className='text-red-400 tracking-wider'></span></div> */}

                    <div className="inputContainer">
                        <svg className="inputIcon" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#2e2e2e" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                        </svg>
                        <input type="password" className="inputField" id="password" name='password' placeholder="Password" onChange={handleChange} />
                    </div>
                    <button id="" className='font-[Syne] font-bold w-full mb-2  z-50 mt-3 text-white tracking-wide h-9 hover:-translate-y-[1px] transition-all duration-300 ease-in-out hover:bg-black bg-orange-400 rounded-sm p-1'>Submit</button>
                    <span>Don't have an account? <Link to={"/signup"}>SignUp</Link></span>
                </form>
            </div>
        </>
    );
}


export default Login;
