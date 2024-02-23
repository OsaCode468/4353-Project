const TotAmount = () => {
    return (
        <>
            <hr className='mb-4 '></hr>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="text-xl block uppercase tracking-wide text-white font-bold mb-2" htmlFor="zipcode">
                        Total Amount Due :
                    </label>
                    {/* <input
                    //(9 characters, at least 5 character code required)
                    id="zipcode"
                    type="text"
                    placeholder="77204"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    pattern="\d{5}(-\d{4})?"
                    //AT LEAST 5, NO MORE THAN 9 DIGITS FOR ZIPCODE
                    title="Enter a 5 or 9 digit zipcode"
                    required
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                /> */}
                </div>
            </div>
        </>
    );
}

export default TotAmount