"use client"
import React, { useState, useEffect } from 'react';
import TotAmount from "../components/TotAmount";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRouter } from "next/navigation"


const FuelQuoteForm = () => {
    const { push } = useRouter();
    const [gallons, setGallons] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryState, setDeliveryState] = useState("")
    const [deliveryDate, setDeliveryDate] = useState("");
    const [priceG, setPriceG] = useState("");
    const [totalAmount, setTotalAmount] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    //const [username, setUsername] = useState("")
    const [id, setID] = useState(null);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const { user } = useAuthContext();
    const username=user?.username;

    useEffect(() => {
        if (user && username) {
            fetchID(username);
        }
        if(id){
            fetchAddress(id);
        }
    }, [user, id]);

    const fetchID = async (username) => {
        try {
            const response = await fetch(`http://localhost:4000/api/fuelquotemodule/getID/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch the id. Please try again.');
            }
            const data = await response.json();
            setID(data.id); // Assuming 'add' contains the delivery address
            // You can also set other states here if needed, e.g., for state or other related data.
        } catch (error) {
            console.error('Error fetching id:', error);
        }
    };

    const fetchAddress = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/fuelquotemodule/getAddress/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch the address. Please try again.');
            }
            const data = await response.json();
            setDeliveryAddress(data.address + ' ' + data.city + ', ' + data.state + ' ' + data.zipcode); // Assuming 'add' contains the delivery address
            setDeliveryState(data.state);
            // You can also set other states here if needed, e.g., for state or other related data.
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            // If user is not logged in and loading is finished, set timer to redirect to login page
            const timer = setTimeout(() => {
                setRedirectToLogin(true);
            }, 1000); // 3 seconds
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [user]); // Trigger effect when user or isLoading changes

    useEffect(() => {
        if (redirectToLogin) {
            push("/Login");
        }
    }, [redirectToLogin]);

    const handleGetQuote = async (e) => {
        // Call your pricing module endpoint
        // Assume the endpoint returns an object with the suggested price and total amount
        e.preventDefault();
        const formData = {
            gallons,
            deliveryState,
            id
            // priceG
        };

        try {
            const response = await fetch('http://localhost:4000/api/pricing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to get the quote. Please try again.');
            }

            const quoteData = await response.json();
            setPriceG(quoteData.ppg)
            setTotalAmount(quoteData.totalAmountDue)
            setFormSubmitted(true);
            // setSuggestedPrice(quoteData.suggestedPrice);
            // setTotalAmount(quoteData.totalAmount);
        } catch (error) {
            console.error('Error getting quote:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            gallons,
            deliveryAddress,
            deliveryDate,
            id,
            priceG,
            totalAmount
        };

        try {
            const response = await fetch('http://localhost:4000/api/fuelquotemodule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save fuel quote. Please try again.');
            }

            if(response.ok){
                alert("Fuel quote successfully ordered");
            }

            // setFormSubmitted(true);
            console.log('Fuel quote saved successfully');
        } catch (error) {
            console.error('Error saving fuel quote:', error);
        }
    }

    return (
        <div>
            <Navbar />
            <div id='farm' className="container mx-auto mt-10">
                <h2 className="text-center text-2xl font-bold mb-5">Fuel Quote Form</h2>
                {/* changed handleSubmit to handleGetQuote */}
                <form onSubmit={handleGetQuote} className="w-full max-w-lg mx-auto">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="full-name">
                                Gallons
                            </label>
                            <input
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
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="address-1">
                                Delivery address
                            </label>
                            <input
                                id="address-1"
                                type="text"
                                placeholder="Fetching delivery address..."
                                className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
                                readOnly
                                value={deliveryAddress}
                            // No onChange handler since the field is read-only
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="address-2">
                                Delivery Date
                            </label>
                            <input
                                id="address-2"
                                type="date"
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                maxLength="100"
                                required
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="city">
                                Suggested Price per gallon
                            </label>
                            <input
                                id="city"
                                type="number"
                                className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
                                readOnly
                                maxLength="100"
                                required
                                value={priceG}
                                onChange={(e) => setPriceG(e.target.value)}
                            />
                        </div>
                    </div>

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
                {formSubmitted &&
                    <>
                        <TotAmount
                            totalAmount={totalAmount}
                        />
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleSubmit}
                            >
                                Submit Quote
                            </button>
                        </div>
                    </>
                }

                {/* {formSubmitted &&
                    <TotAmount
                        totalAmount={totalAmount}
                    // gallons={gallons}
                    // deliveryAddress={deliveryAddress}
                    // deliveryDate={deliveryDate}
                    // priceG={priceG}
                    />
                } */}
            </div>
        </div>
    );
}

export default FuelQuoteForm;








// "use client";
// const Pricing = require('../../../../../backend/routes/pricingModule')
// const pg = new Pricing();
// import React, { useState } from 'react';
// import TotAmount from "../components/TotAmount"
// import Navbar from "../components/Navbar"

// const FuelQuoteForm = () => {
//     const [gallons, setGallons] = useState("");
//     const [deliveryAddress, setDeliveryAddress] = useState("4302 University Drive");
//     const [deliveryDate, setDeliveryDate] = useState("");
//     const [priceG, setPriceG] = useState(pg.getPricePerGallon());
//     const [formSubmitted, setFormSubmitted] = useState(false);


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = {
//             gallons,
//             deliveryAddress,
//             deliveryDate,
//             priceG
//         };

//         try {
//             const response = await fetch('http://localhost:4000/api/fuelquotemodule', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to save fuel quote. Please try again.');
//             }
//             console.log(formData);

//             setFormSubmitted(true);
//             console.log('Fuel quote saved successfully');
//         } catch (error) {
//             console.error('Error saving fuel quote:', error);
//         }
//     }

//     return (
//         <div>
//             <Navbar />
//             <div id='farm' className="container mx-auto mt-10">
//                 <h2 className="text-center text-2xl font-bold mb-5">Fuel Quote Form</h2>
//                 <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
//                     <div className="flex flex-wrap -mx-3 mb-6">
//                         <div className="w-full px-3">
//                             <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="full-name">
//                                 Gallons
//                             </label>
//                             <input
//                                 id="num-gallons"
//                                 type="number"
//                                 placeholder="4.67"
//                                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//                                 maxLength="50"
//                                 required
//                                 value={gallons}
//                                 onChange={(e) => setGallons(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap -mx-3 mb-6">
//                         <div className="w-full px-3">
//                             <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="address-1">
//                                 Delivery address
//                             </label>
//                             <input
//                                 id="address-1"
//                                 type="text"
//                                 placeholder="4302 University Drive"
//                                 className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
//                                 readOnly
//                                 value={deliveryAddress}
//                                 onChange={(e) => setDeliveryAddress(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap -mx-3 mb-6">
//                         <div className="w-full px-3">
//                             <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="address-2">
//                                 Delivery Date
//                             </label>
//                             <input
//                                 id="address-2"
//                                 type="date"
//                                 className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//                                 maxLength="100"
//                                 required
//                                 value={deliveryDate}
//                                 onChange={(e) => setDeliveryDate(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap -mx-3 mb-6">
//                         <div className="w-full px-3">
//                             <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="city">
//                                 Suggested Price per gallon
//                             </label>
//                             <input
//                                 id="city"
//                                 type="number"
//                                 placeholder="3.87"
//                                 className="appearance-none block w-full bg-gray-500 text-white border border-gray-200 rounded py-3 px-4 leading-tight"
//                                 readOnly
//                                 maxLength="100"
//                                 required
//                                 value={priceG}
//                                 onChange={(e) => setPriceG(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap -mx-3 mt-6">
//                         <div className="w-full px-3 text-center">
//                             <button
//                                 id='butter'
//                                 type="submit"
//                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             >
//                                 Get Quote
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//                 {formSubmitted &&
//                     <TotAmount
//                         gallons={gallons}
//                         deliveryAddress={deliveryAddress}
//                         deliveryDate={deliveryDate}
//                         priceG={priceG}

//                     />
//                 }
//             </div>
//         </div>
//     )
// }

// export default FuelQuoteForm