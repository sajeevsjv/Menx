import React, { useState } from "react";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu on mobile when a link is clicked
  };

  return (
    <nav className=" text-black border-b-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block lg:hidden text-black focus:outline-none w-[45%]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Nav Links Dropdown for Mobile */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } absolute top-16 left-0 w-full bg-white z-10 border-b-2 lg:hidden `}
          >
            {["Home", "Products", "Shop", "Contact", "MyShop"].map((tab) => (
              <a
                key={tab}
                href="#"
                className={`block px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out text-xs${
                  activeTab === tab ? "text-orange-500 text-xs font-semibold" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </a>
            ))}
          </div>

          {/* Nav Links for Desktop */}
          <div className="hidden lg:flex gap-2 w-[45%] ">
            {["Home", "Products", "Shop", "Contact", "MyShop"].map((tab) => (
              <a
                key={tab}
                href="#"
                className={`nav-link px-1 text-sm tracking-wider py-2 rounded-md hover:text-orange-400 ${
                  activeTab === tab ? "font-semibold text-orange-400" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </a>
            ))}
          </div>

          {/* Center Text Logo */}
          <div className="text-xl uppercase tracking-[4px] font-bold">
            <a href="#">Menx.</a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 justify-end w-[45%]">
            {/* Search Field */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search"
                className="rounded-md pl-3 pr-10 py-1 text-black focus:outline-none"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 px-3 py-1 bg-gray-600 rounded-r-md hover:bg-gray-500"
              >
                Go
              </button>
            </div>

            <ion-icon name="heart-outline" />
                    <ion-icon name="bag-outline" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="hover:text-gray-300  focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 19.073A6 6 0 0110 21h4a6 6 0 014.879-1.927l1.12-7.446a4 4 0 00-.659-3.65l-1.1-1.1a4 4 0 00-5.657 0l-1.1 1.1a4 4 0 00-.659 3.65l1.12 7.446z"
                  />
                </svg>
              </button>
              {profileDropdownOpen && (
                <div className="absolute z-10 right-0 mt-2 bg-white text-black rounded-md shadow-lg w-48">
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
