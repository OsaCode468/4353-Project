"use client"
import React, { useState } from 'react';

import TotAmount from "../components/totAmount"
import Navbar from "../components/Navbar"
const FuelQuoteForm = () => {
    const [gallons, setGallons] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("4302 University Drive");
    const [deliveryDate, setDate] = useState("");
    const [priceG, setPriceG] = useState("3.25");
    // const [state, setState] = useState("");
    // const [zipcode, setZipcode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // const farm = document.querySelector('#farm')
        // const butter = document.querySelector('#butter')
        // farm.insertBefore(<TotAmount />, butter)
        console.log(gallons, deliveryAddress, deliveryDate, priceG);
    }

    return (
        <div>
            <Navbar />
            <div id='farm' className="container mx-auto mt-10">
                <h2 className="text-center text-2xl font-bold mb-5">Fuel Quote Form</h2>
                <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="full-name">
                                Gallons
                            </label>
                            <input
                                //(50 characters, required)
                                id="num-gallons"
                                type="number"
                                placeholder="4.67"
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                maxLength="50"
                                required
                                value={gallons}
                                onChange={(e) => setGallons(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address-1">
                                Delivery address
                            </label>
                            <input
                                id="address-1"
                                type="text"
                                placeholder="4302 University Drive"
                                className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
                                readOnly
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />

                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address-2">
                                Delivery Date
                            </label>
                            <input
                                //(100 characters, optional**
                                id="address-2"
                                type="date"
                                // placeholder="03/27/2002"
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                maxLength="100"
                                //NOT REQUIRED!!!
                                required
                                value={deliveryDate}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="city">
                                Suggested Price per gallon
                            </label>
                            <input
                                //(100 characters, required)
                                id="city"
                                type="number"
                                placeholder="3.25"
                                className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
                                readOnly
                                maxLength="100"
                                required
                                value={priceG}
                                onChange={(e) => setPriceG(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                                State
                            </label>
                            <div className="relative">
                                <select
                                    //(Drop Down, selection required) DB will store 2 character state code
                                    id="state"
                                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="">Select a state</option>
                                    {statesArray.map((stateOption) => (
                                        <option key={stateOption.code} value={stateOption.code}>
                                            {stateOption.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div> */}

                    {/* <TotAmount /> */}


                    <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3 text-center">
                            <button
                                id='butter'
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Get Quote
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

}
export default FuelQuoteForm