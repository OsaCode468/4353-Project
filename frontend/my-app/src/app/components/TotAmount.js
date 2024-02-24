const TotAmount = ({ gallons, deliveryAddress, deliveryDate, priceG }) => {
    // Calculate total amount
    const totalAmount = (parseFloat(gallons) * parseFloat(priceG)).toFixed(2); // Assuming priceG is a string, parse it to float

    return (
        <>
            <hr className='my-8'></hr>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="text-xl block uppercase tracking-wide text-white font-bold mb-2" htmlFor="zipcode">
                        Total Amount Due :
                    </label>
                    {/* <p className="text-white">{`Delivery Address: ${deliveryAddress}`}</p>
                    <p className="text-white">{`Delivery Date: ${deliveryDate}`}</p>
                    <p className="text-white">{`Price per Gallon: $${priceG}`}</p> */}
                    <p className="text-xl font-medium text-white">{`$${totalAmount}`}</p>
                </div>
            </div>
        </>
    );
}

export default TotAmount;




// const TotAmount = ({ gallons, deliveryAddress, deliveryDate, priceG }) => {
//     return (
//         <>
//             <hr className='my-8 '></hr>
//             <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                     <label className="text-xl block uppercase tracking-wide text-white font-bold mb-2" htmlFor="zipcode">
//                         Total Amount Due :
//                     </label>
//                     <p className="text-white">{`Gallons: ${gallons}`}</p>
//                     <p className="text-white">{`Delivery Address: ${deliveryAddress}`}</p>
//                     <p className="text-white">{`Delivery Date: ${deliveryDate}`}</p>
//                     <p className="text-white">{`Price per Gallon: ${priceG}`}</p>
//                     {/* <input
//                     //(9 characters, at least 5 character code required)
//                     id="zipcode"
//                     type="text"
//                     placeholder="77204"
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//                     pattern="\d{5}(-\d{4})?"
//                     //AT LEAST 5, NO MORE THAN 9 DIGITS FOR ZIPCODE
//                     title="Enter a 5 or 9 digit zipcode"
//                     required
//                     value={zipcode}
//                     onChange={(e) => setZipcode(e.target.value)}
//                 /> */}
//                 </div>
//             </div>
//         </>
//     );
// }

// export default TotAmount;





