"use client"
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext"; // Import useAuthContext

const ClientProfileManagement = () => {
  const stateOptions = [
    "AL", "AK", "AZ", "AR", "CA",
    "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO",
    "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH",
    "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT",
    "VA", "WA", "WV", "WI", "WY"
];

  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const { user } = useAuthContext(); // Get the user object from the Auth context

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      fullName,
      address1,
      address2,
      city,
      state,
      zipcode,
      username: user.username // Include the username in the profile data
    };

    try {
      const response = await fetch('http://localhost:4000/api/clientmodule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to save profile. Please try again.');
      }

      const data = await response.json();
      console.log('Profile saved successfully:', data);
      alert('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please check the console for more information.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h2 className="text-center text-2xl font-bold mb-5">Client Profile Management</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="full-name">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address-1">
                Address 1
              </label>
              <input
                id="address-1"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address-2">
                Address 2
              </label>
              <input
                id="address-2"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                State
              </label>
              <div className="relative">
                <select
                  id="state"
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Select a state</option>
                    {/* Dynamically generate state options */}
            {stateOptions.map((stateName, index) => (
              <option key={index} value={stateName}>{stateName}</option>
            ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zipcode">
                Zipcode
              </label>
              <input
                id="zipcode"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                pattern="\d{5}(-\d{4})?"
                title="Enter a 5 or 9 digit zipcode"
                required
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mt-6">
            <div className="w-full px-3 text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientProfileManagement;