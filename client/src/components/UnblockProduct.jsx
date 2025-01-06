import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const UnblockProductForm = ({ productId, onClose, onUnblockSuccess }) => {

  const handleUnblock = async () => {
    // Show "Processing" toast when the request starts
    const processingToast = toast.loading("Processing your request...");

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `http://localhost:3003/blockproduct/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      onUnblockSuccess(productId, false); // Assuming false indicates the product is unblocked
      // Update toast to success message
      toast.update(processingToast, {
        render: "Product unblocked successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      onClose(); // Close the form after submission
    } catch (error) {
      // Update toast to error message
      toast.update(processingToast, {
        render: "Failed to unblock the product. Please try again.",
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
          <h2 className="text-lg font-bold">Unblock Product</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold hover:underline"
          >
            Close
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to unblock this product?
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUnblock}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Unblock
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UnblockProductForm;
