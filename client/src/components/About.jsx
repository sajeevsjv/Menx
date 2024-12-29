import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">About Menx</h1>
        <p className="text-lg text-gray-600 mt-2">
          Menx is dedicated to redefining men’s fashion by combining quality, style, and affordability. Our goal is to make every man look and feel confident, one outfit at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            At Menx, we believe that fashion is not just about clothing but about self-expression. Our mission is to bring you the latest trends and timeless classics, ensuring there’s something for everyone.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>High-quality materials for lasting wear.</li>
            <li>Affordable prices without compromising style.</li>
            <li>Wide selection catering to various preferences.</li>
            <li>Dedicated customer support to assist you every step of the way.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Join Our Journey</h2>
        <p className="text-center text-gray-600">
          Discover the Menx experience today and let us help you elevate your wardrobe. From casual wear to formal attire, we’ve got you covered.
        </p>
      </div>
    </div>
  );
};

export default About;
