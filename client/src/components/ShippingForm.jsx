import React, { useState } from 'react';
import UserNavbar from './UserNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { DataContext } from './DataProvider';

const ShippingForm = () => {
  const { showShippingForm, setShowShippingForm} = useContext(DataContext);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    phone: '',
  });

  const [submittedData, setSubmittedData] = useState([]);

  function toggleshippingform() {
    setShowShippingForm(!showShippingForm);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const countryCode = formData.countryCode || "+91"; // Default to +91 if not selected
    const fullPhoneNumber = `${countryCode}${formData.phone}`;

    // Create a new object with the full phone number
    const updatedFormData = { ...formData, phone: fullPhoneNumber };

    setSubmittedData([...submittedData, updatedFormData]);
    console.log('Shipping Details:', updatedFormData);
    console.log('All Submitted Data:', submittedData);
    const authToken = localStorage.getItem("authToken");
    const user_id = localStorage.getItem("user_id");

    try{
      let response = await axios({
        url : `http://localhost:3003/shippingadress/${user_id}`,
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${authToken}`
        },
        data : formData
      })
      console.log("response :",response);
      let message = response.data.message;
      toast.success(message);  
    }
    catch(error){
      if(error.response){
        console.log("eror response :",error.response);
        let error_message = error.response.data.message;
        toast.error(error_message);
      }
      else{
        console.log("error :",error);
      }
    }
  };

  return (
    <>
      <UserNavbar />
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-[67px]  bg-white p-6 rounded-lg shadow-md space-y-2"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Shipping Details</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex space-x-2">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
              className="block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-3/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md shadow transition-all ease-in duration-300 hover:bg-black hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default ShippingForm;
