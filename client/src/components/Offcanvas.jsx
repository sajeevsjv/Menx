import React, { useState } from 'react';

const Offcanvas = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOffcanvas = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        onClick={toggleOffcanvas}
      >
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Offcanvas Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg z-50`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">Offcanvas Menu</h2>
          <button
            className="mt-4 bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600"
            onClick={toggleOffcanvas}
          >
            Close
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Services</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleOffcanvas}
        ></div>
      )}
    </div>
  );
};

export default Offcanvas;
