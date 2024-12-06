import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [productData, setProductData] = useState(null)

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const { id } = useParams();

  useEffect(() => {

    function fetchData() {
      const authToken = localStorage.getItem("authToken");
      console.log("authToken :", authToken);
      axios({
        url: `http://localhost:3003/getsingleproduct/${id}`,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      })
        .then((response) => {
          console.log("response :", response);
          let data = response.data.data;
          setProductData(data);
        })
        .catch((error) => {
          if (error.response) {
            console.log("response :", error.response.message);
            return;
          }
          console.log("error :", error);

        })

    }
    fetchData()
  }, [id])

  return (
    <>
      <UserNavbar />
      {productData ?
        <div className="product-pg-container mt-20  pt-3 w-full flex">
          <div className="product-img-section grid grid-cols-2 gap-1 justify-center pl-5 w-1/2">
            {productData.product_images &&
              productData.product_images.map((image, index) => (
                <div
                  key={index}
                  className={`img${index === 0 ? "1 col-span-2 flex justify-center" : "3"}`}
                >
                  <img
                    src={`http://localhost:3003/${image}`}
                    alt={`Product Image ${index + 1}`}
                    className={index === 0 ? "w-full" : "w-auto"}
                  />
                </div>
              ))}
          </div>

          <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
            <p className="text-gray-500 text-sm mb-2">SKU: 0007</p>
            <h2 className="text-xl font-semibold mb-4">${productData.price}</h2>
            <button
              className="flex items-center justify-between w-full text-left text-lg font-semibold border-b-2 border-gray-300 py-2"
              onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
            >
              Description {isDescriptionVisible ? "-" : "+"}
            </button>
            {isDescriptionVisible && (
              <p className="text-gray-700 mt-2">
                {productData.description}
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
        : <h3>loading..</h3>
      }



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
