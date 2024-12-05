import React, { useState } from "react";
import UserNavbar from "./UserNavbar";

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  return (
    <> 
      <UserNavbar />
      <div className="product-pg-container mt-10  pt-3 w-full flex">
        <div className="product-img-section grid grid-cols-2 gap-1 justify-center pl-5 w-1/2">
        <div className="img1 col-span-2 flex justify-center"><img  src="images\IMG_0038_544a5aef-6e53-4286-aa9c-ca80edd14d3e_480x.webp" alt="" /></div>
        <div className="img2"><img src="images\IMG_0050_9255e69b-cddb-44cc-b6e9-567fc16a1302_480x.webp" alt="" /></div>
        <div className="img3"><img src="images\IMG_0085_8ae1dc7e-208e-4758-a1ca-0e7ab28f9dc2_480x.webp" alt="" /></div>
        </div>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">BUTTONED UP LINEN SHIRT</h1>
        <p className="text-gray-500 text-sm mb-2">SKU: 0007</p>
        <h2 className="text-xl font-semibold mb-4">$45.00</h2>
        <button
          className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
          onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
        >
          Description {isDescriptionVisible ? "-" : "+"}
        </button>
        {isDescriptionVisible && (
          <p className="text-gray-700 mt-2">
            I'm a product description. I'm a great place to add more details
            about your product such as sizing, material, care instructions, and
            cleaning instructions.
          </p>
        )}
        <div className="my-6">
          <label className="block font-semibold mb-2">QUANTITY</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="bg-gray-200 hover:bg-gray-300 text-lg px-3 py-1 rounded"
            >
              -
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="bg-gray-200 hover:bg-gray-300 text-lg px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="flex-1 bg-black text-white py-2 text-center rounded hover:bg-gray-800">
            Add to Cart
          </button>
          <button className="flex-1 border border-black py-2 text-center rounded hover:bg-gray-100">
            Buy Now
          </button>
        </div>
        <CollapsibleSection title="PRODUCT INFO">
          <p className="text-gray-700">
            Detailed product info goes here, including sizing and care.
          </p>
        </CollapsibleSection>
        <CollapsibleSection title="RETURN & REFUND POLICY">
          <p className="text-gray-700">Details about the return policy go here.</p>
        </CollapsibleSection>
      </div>
      </div>
      
    </>
  );
};

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4">
      <button
        className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title} {isOpen ? "-" : "+"}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default ProductPage;
