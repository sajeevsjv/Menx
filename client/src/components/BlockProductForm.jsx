import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const BlockProductForm = ({ productId, onClose}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show "Processing" toast when the request starts
    const processingToast = toast.loading("Processing your request...");

    try {
      const authToken = localStorage.getItem("authToken");

      let response = await axios.put(
        `http://localhost:3003/blockproduct/${productId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      let message = response.data.message;
      toast.update(processingToast, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      onClose(); // Close the form after submission
    } catch (error) {
      // Update toast to error message
      console.log("errorrrrr" , error);
      toast.update(processingToast, {
        render: "Failed to block the product. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Block Product</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold hover:underline"
          >
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="reason" className="block mb-2 font-semibold">
            Reason for Blocking
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            rows="4"
            placeholder="Enter the reason for blocking this product"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BlockProductForm;
