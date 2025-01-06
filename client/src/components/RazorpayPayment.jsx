import React, { useState, useEffect } from "react";

const RazorpayPayment = () => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // Load the Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded.");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
    };
    document.body.appendChild(script);

    // Clean up the script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    const amountInPaisa = parseInt(amount) * 100; // Convert ₹ to paisa

    if (!amount || amountInPaisa <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_U2bwAbL6Qs3sKx", // Replace with your test key ID
      amount: amountInPaisa,
      currency: "INR",
      name: "Your Test Business",
      description: "Test Transaction",
      image: "https://your_logo_url.com/logo.png",
      handler: (response) => {
        alert("Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);

        // Example backend call
        fetch("/your-backend-endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment_id: response.razorpay_payment_id }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Backend Response:", data);
          })
          .catch((error) => {
            console.error("Error in backend call:", error);
          });
      },
      prefill: {
        name: "Test User",
        email: "testuser@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      alert("Payment Failed!");
      console.error(response.error);
    });

    rzp.open();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Test Razorpay Payment</h1>
      <label htmlFor="amount">Enter Amount (₹):</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in ₹"
        style={{
          marginLeft: "10px",
          padding: "5px",
          fontSize: "16px",
          width: "150px",
        }}
      />
      <button
        onClick={handlePayment}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default RazorpayPayment;
