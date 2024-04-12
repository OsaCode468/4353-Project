const request = require("supertest");
const express = require("express");
const router = require("../routes/fuelQuoteHistoryModule");

// Mocking the pool module
jest.mock('../connection', () => ({
  connect: jest.fn(),
}));

const app = express();
app.use("/", router);

describe("GET /getID/:username", () => {
  test("It should respond with status 200 and the customer ID", async () => {
    // Mocking the query result
    const mockQueryResult = {
      rows: [{ id: 123 }]
    };

    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce(mockQueryResult),
      release: jest.fn()
    });

    const response = await request(app).get("/getID/someUsername");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mssg: "Got customer ID",
      id: 123
    });
  });

  test("It should respond with status 500 if an error occurs", async () => {
    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get("/getID/someUsername");
    expect(response.statusCode).toBe(500);
  });
});

describe("GET /checkCustomer/:id", () => {
  test("It should respond with status 200 and the count of fuel quotes", async () => {
    // Mocking the query result
    const mockQueryResult = {
      rows: [{ count: 3 }]
    };

    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce(mockQueryResult),
      release: jest.fn()
    });

    const response = await request(app).get("/checkCustomer/123");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mssg: "Got count",
      count: 3
    });
  });

  test("It should respond with status 500 if an error occurs", async () => {
    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get("/checkCustomer/123");
    expect(response.statusCode).toBe(500);
  });
});

describe("GET /:id", () => {
  test("It should respond with status 200 and the fuel quote history data", async () => {
    // Mocking the query result
    const mockQueryResult = {
      rows: [
        {
          gallons_requested: 550,
          delivery_address: "7404 Marlborough Rd. New Kensington, PA 15068",
          delivery_date: "2024-05-20",
          price_per_gallon: 3.276,
          total_amount_due: 1801.80
        },
        {
          gallons_requested: 350,
          delivery_address: "7404 Marlborough Rd. New Kensington, PA 15068",
          delivery_date: "2024-04-22",
          price_per_gallon: 3.279,
          total_amount_due: 1147.65
        },
        {
          gallons_requested: 600,
          delivery_address: "7404 Marlborough Rd. New Kensington, PA 15068",
          delivery_date: "2024-03-15",
          price_per_gallon: 3.225,
          total_amount_due: 1935.00
        }
      ]
    };

    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce(mockQueryResult),
      release: jest.fn()
    });

    const response = await request(app).get("/123");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mssg: "Get all fuel quote history",
      fuelQuoteHistoryData: mockQueryResult.rows
    });
  });

  test("It should respond with status 500 if an error occurs", async () => {
    // Mocking the pool connection behavior
    const mockPool = require('../connection');
    mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get("/123");
    expect(response.statusCode).toBe(500);
  });
});