"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import classes from "./page.module.css";

function FuelQuoteHistory() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState(null);
  const [id, setId] = useState(null);
  const [isPrevCustomer, setIsPrevCustomer] = useState(false);

  const username = "username";

  useEffect(() => {
    const fetchID = async () => {
      const response = await fetch(
        `http://localhost:4000/api/fuelQuoteHistory/getID/${username}`
      );
      const json = await response.json();
      console.log(json.id);

      if (!response.ok) {
        throw new Error("There was an error fetching data.");
      }
      if (response.ok) {
        setId(json.id);
      }
    };

    fetchID();
  }, []);

  useEffect(() => {
    if (id) {
      const checkCustomer = async () => {
        const response = await fetch(
          `http://localhost:4000/api/fuelQuoteHistory/checkCustomer/${id}`
        );
        const json = await response.json();
        const count = json.count;

        if (!response.ok) {
          throw new Error("There was an error fetching data.");
        }
        if (response.ok) {
          if (count > 0) {
            setIsPrevCustomer(true);
          }
        }
      };

      checkCustomer();
    }
  }, [id]);

  useEffect(() => {
    // Updating a state causes a re-render
    if (id) {
      const fetchHistory = async () => {
        const response = await fetch(
          `http://localhost:4000/api/fuelQuoteHistory/${id}`
        );
        const json = await response.json();
        //console.log(json.fuelQuoteHistoryData);

        if (!response.ok) {
          throw new Error("There was an error fetching data.");
        }
        if (response.ok) {
          setQuoteHistory(json.fuelQuoteHistoryData);
          setInitialRenderComplete(true);
        }
      };

      fetchHistory();
    }
  }, [id]);

  /*useEffect(() => {
    if (quoteHistory) {
      const updatedData = quoteHistory.map((item) => ({
        ...item,
        totalAmount: (item.gallonsRequested * item.priceGallon).toFixed(2),
      }));
      setUpdatedData(updatedData);
      setInitialRenrCompledete(true);
    }
  }, [quoteHistory]);*/

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

  return !isPrevCustomer ? (
    <div>
      <Navbar />
      <div className={classes.message}>No Order History</div>
    </div>
  ) : (
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
          {quoteHistory.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.gallons_requested}</td>
                <td>{val.delivery_address}</td>
                <td>{val.delivery_date}</td>
                <td>{val.price_per_gallon}</td>
                <td>{val.total_amount_due}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default FuelQuoteHistory;