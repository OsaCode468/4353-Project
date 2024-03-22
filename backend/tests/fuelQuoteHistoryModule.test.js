const request = require("supertest");
const express = require("express");
const router = require("../routes/fuelQuoteHistoryModule");

const app = express();
app.use("/", router);

describe("GET /:name", () => {
  test("It should respond with status 200", async () => {
    const response = await request(app).get("/someName");
    expect(response.statusCode).toBe(200);
  });

  test("It should respond with fuel quote history data", async () => {
    const response = await request(app).get("/someName");
    expect(response.body).toEqual({
      mssg: "Get all fuel quote history",
      fuelQuoteHistoryData: [
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
      ],
    });
  });
});