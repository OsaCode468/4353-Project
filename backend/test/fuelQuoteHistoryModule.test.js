const request = require("supertest");
const express = require("express");
const router = require("../routes/fuelQuoteHistoryModule"); // Adjust the path as necessary

// Mock the database connection module
jest.mock('../connection', () => ({
  connect: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("Fuel Quote History Module API", () => {
  describe("GET /getID/:username", () => {
    test("It should respond with status 200 and the customer ID", async () => {
      const mockQueryResult = {
        rows: [{ id: 123 }]
      };
      const mockPool = require('../connection');
      mockPool.connect.mockResolvedValueOnce({
        query: jest.fn().mockResolvedValueOnce(mockQueryResult),
        release: jest.fn()
      });

      const response = await request(app).get("/getID/testuser");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        mssg: "Got customer ID",
        id: 123
      });
    });

    test("It should respond with status 500 if an error occurs", async () => {
      const mockPool = require('../connection');
      mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get("/getID/testuser");
      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe("GET /checkCustomer/:id", () => {
    test("It should respond with status 200 and the count of fuel quotes", async () => {
      const mockQueryResult = {
        rows: [{ count: 5 }]
      };
      const mockPool = require('../connection');
      mockPool.connect.mockResolvedValueOnce({
        query: jest.fn().mockResolvedValueOnce(mockQueryResult),
        release: jest.fn()
      });

      const response = await request(app).get("/checkCustomer/123");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        mssg: "Got count",
        count: 5
      });
    });

    test("It should respond with status 500 if an error occurs", async () => {
      const mockPool = require('../connection');
      mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get("/checkCustomer/123");
      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });

  describe("GET /:id", () => {
    test("It should respond with status 200 and all fuel quote history data", async () => {
      const mockQueryResult = {
        rows: [
          { gallons_requested: 200, price_per_gallon: 2.50, total_amount_due: 500 },
          { gallons_requested: 150, price_per_gallon: 2.75, total_amount_due: 412.5 }
        ]
      };
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
      const mockPool = require('../connection');
      mockPool.connect.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get("/123");
      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Internal Server Error');
    });
  });
});