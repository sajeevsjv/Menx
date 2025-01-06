import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellerNavbar = () => {
  const [activeTab, setActiveTab] = useState("All"); // State for active tab
  const navigate = useNavigate();
  const handleTabClick = (tab) => {

    setActiveTab(tab);

    // Specific functionality for "Earnings"
    if (tab === "Earnings") {
      navigate("/myearnings");
    }
    else{
      navigate("/myshop");
    }
  };

  return (
    <div className="sellernavbar mt-14">
      <ul className="flex space-x-4 justify-center text-md font-normal border-b-[1px] pb-2 tracking-wider">
        {["Products", "Earnings"].map((tab) => (
          <li
            key={tab}
            className={`border-b-2 p-2 ${activeTab === tab ? "border-orange-300" : "border-transparent"
              } cursor-pointer`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerNavbar;
