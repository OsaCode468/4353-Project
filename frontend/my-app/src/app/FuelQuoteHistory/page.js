"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import classes from "./page.module.css";

const data = [
  {
    gallonsRequested: 550,
    deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
    deliveryDate: "2024-05-20",
    priceGallon: 3.276,
  },
  {
    gallonsRequested: 350,
    deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
    deliveryDate: "2024-04-22",
    priceGallon: 3.279,
  },
  {
    gallonsRequested: 600,
    deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
    deliveryDate: "2024-03-15",
    priceGallon: 3.225,
  },
];

const updatedData = data.map((item) => ({
  ...item,
  totalAmount: (item.gallonsRequested * item.priceGallon).toFixed(2),
}));

function FuelQuoteHistory() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning a loading indicator
    return (
      <section>
        <p>Loading...</p>
      </section>
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
          {updatedData.map((val, key) => {
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
