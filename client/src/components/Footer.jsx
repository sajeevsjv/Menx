import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">About Menx</h3>
            <p className="text-sm text-gray-400">
              Menx is your go-to destination for the latest trends in men's fashion. We provide quality and style at unbeatable prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/shop" className="text-sm text-gray-400 hover:text-white">Shop</a></li>
              <li><a href="/about" className="text-sm text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/faq" className="text-sm text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Menx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
