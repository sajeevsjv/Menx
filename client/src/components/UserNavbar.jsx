import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu on mobile when a link is clicked
  };

  return (
    <nav className=" text-black bg-white border-b-[1px] p-2 fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3">
        <div className="flex items-center justify-between h-12">
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
            {["Home", "Products", "Shop", "Contact"].map((tab) => (
              <a
                key={tab}
                href="#"
                className={`block px-4 py-2 overflow-hidden transition-all duration-300 ease-in-out text-xs${
                  activeTab === tab ? "text-orange-500 text-xs " : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </a>
            ))}
          </div>

          {/* Nav Links for Desktop */}
          <div className="hidden lg:flex gap-2 w-[45%] ">
            {["Home", "Products", "Shop", "Contact"].map((tab) => (
              <a
                key={tab}
                href="/sellerhome"
                className={`nav-link px-1 text-sm tracking-wider py-2 rounded-md hover:text-orange-400 ${
                  activeTab === tab ? "text-orange-400" : ""
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
                className=" pl-3 pr-10 py-1 border-2 text-black focus:outline-none"
              />
              <button
                type="submit"
                className="absolute  h-9 top-0 right-0 px-3 py-1 bg-orange-400  hover:bg-black hover:text-white"
              >
                Go
              </button>
            </div>

            <ion-icon name="heart-outline" />
                    <ion-icon name="bag-outline" />

            {/* Profile Dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-7 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    SignIn
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    SignUp
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
