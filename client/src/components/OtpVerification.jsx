import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useMemo } from 'react';

function OtpVerification() {

  const [otpInput, setOtpInput] = useState("")
  const [otpAttemptCount, setOtpAttemptCount] = useState(1);

  console.log("otpVerification component rendering");

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only numeric input
      setOtpInput(value);
    }
  };

  // Handle form submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("submit btn clicked..")
    try {
      let response = await axios({
        url: "http://localhost:3000/otp-verification",
        method: "POST",
        headers: {
          "ContentType": "application/json"
        },
        data: { otp: otpInput }
      })

      console.log("response :", response);
      console.log("response data :", response.data);
      alert(reseponse.data.message);
    }
    catch (err) {
      if (err.response) {
        console.log("response :", err.response);
        

      }
      else {
        alert(err.message ? err.message : err.message);
      }

    }
  };

  const resendOtp = (e) => {
    e.preventDefault();
    console.log()
    setOtpAttemptCount((prev) => (prev = prev + 1));
    if (otpAttemptCount > 3) {
      alert("Maximum verification attempts reached. Please try again after ")
      return;
    }
  }
  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleOtpSubmit}>
          <div>
            <span className="login-txt">OTP</span>
          </div>
          <div className="otp-section">
            <input
              type="text"
              id="otp-input"
              maxLength="6"
              placeholder="Enter OTP"
              onChange={handleOtpChange}
            />
            <div className="timerandresend">
              <div className="resendOption" disabled={true}><a href="" onClick={resendOtp} >Resend otp?</a></div>
            </div>
          </div>
          <button id="submitBtn">
            Verify
          </button>
        </form>
        <div className="img-section">
          <span>Verify your OTP</span>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
