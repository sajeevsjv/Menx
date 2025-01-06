import React from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { DataContext } from "./DataProvider";

const AdminNav = () => {

    const { currentView, setCurrentView } = useContext(DataContext);


    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.success("Successfully logged out");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } else {
            toast.error("Failed to logout");
        }
    };

    const handleAdminPanelVisible = () => {
        setIsAdminPanelVisible(!isAdminPanelVisible)
    }


    return (
        <>
            {/* Header */}
            <nav className="p-4 px-8 z-50 fixed top-0 w-full bg-white shadow-md flex justify-between items-center">

    
                <ul className="flex tracking-wide gap-2 w-[25%]">
                    <li>
                        Home
                    </li>
                    <li onClick={() => setCurrentView("allusers")} className="cursor-pointer">
                        AllUsers
                    </li>
                    <li onClick={() => setCurrentView("buyers")} className="cursor-pointer">
                        Buyers
                    </li>
                    <li onClick={() => setCurrentView("sellers")} className="cursor-pointer">
                        Sellers
                    </li>
                    <li onClick={() => setCurrentView("products")} className="cursor-pointer">
                        Products
                    </li>
                </ul>
                <h2 className="text-2xl font-bold tracking-wide text-orange-500">Dashboard</h2>
                <div className="w-[25%] flex justify-end">
                <button className="Btn">
                    <div className="sign">
                        <svg viewBox="0 0 512 512">
                            <path
                                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                            ></path>
                        </svg>
                    </div>



                    <div onClick={handleSignOut} className="text">Logout</div>
                </button>
                </div>

            </nav>



        </>
    )
}
export default AdminNav;