"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import classes from "./page.module.css";

function FuelQuoteHistory() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  const name = "Jeffrey"; //using a dummy name now, but

  useEffect(() => {
    // Updating a state causes a re-render
    const fetchHistory = async () => {
      const response = await fetch(
        `http://localhost:4000/api/fuelQuoteHistory/${name}`
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error("There was an error fetching data.");
      }
      if (response.ok) {
        setQuoteHistory(json.fuelQuoteHistoryData);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    if (quoteHistory) {
      const updatedData = quoteHistory.map((item) => ({
        ...item,
        totalAmount: (item.gallonsRequested * item.priceGallon).toFixed(2),
      }));
      setUpdatedData(updatedData);
      setInitialRenderComplete(true);
    }
  }, [quoteHistory]);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning a loading indicator
    return (
      <div>
        <h1>Status:</h1>
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <table className={classes.fuelquotehistorytable}>
        <caption>Fuel Quote History</caption>
        <thead>
          <tr>
            <th>Gallons Requested</th>
            <th>Delivery Address</th>
            <th>Delivery Date</th>
            <th>Suggested Price/Gallon</th>
            <th>Total Amount Due</th>
          </tr>
        </thead>
        <tbody>
          {updatedData &&
            updatedData.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.gallonsRequested}</td>
                  <td>{val.deliveryAddress}</td>
                  <td>{val.deliveryDate}</td>
                  <td>{val.priceGallon}</td>
                  <td>{val.totalAmount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
export default FuelQuoteHistory;