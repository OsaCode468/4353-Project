const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const fuelRouter = require('../routes/fuelQuoteModule');

const app = express();

// Add body parser middleware
app.use(bodyParser.json());

// Mount the router
app.use('/fuel', fuelRouter);

describe('POST /fuel', () => {
    test('should respond with status 200 and a success message when valid data is provided', async () => {
        const response = await request(app)
            .post('/fuel')
            .send({ gallons: 100, deliveryDate: '2024-03-29' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Fuel quote saved successfully');
        expect(response.body.fuelQuote).toEqual(expect.objectContaining({
            gallons: 100,
            deliveryDate: '2024-03-29',
            totalPrice: 325 // Assuming the totalPrice calculation logic is $3.25 per gallon
        }));
    });

    test('should respond with status 400 and an error message when gallons requested is not a numeric value', async () => {
        const response = await request(app)
            .post('/fuel')
            .send({ gallons: 'invalid', deliveryDate: '2024-03-29' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Gallons requested must be a numeric value');
    });

    test('should respond with status 400 and an error message when delivery date is not provided', async () => {
        const response = await request(app)
            .post('/fuel')
            .send({ gallons: 100 });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Delivery date is required');
    });
});





// const request = require('supertest');
// const express = require('express');
// const fuelQuoteRoutes = require('../routes/fuelQuoteModule');

// const app = express();
// app.use(express.json());
// app.use('/api/fuelQuoteModule', fuelQuoteRoutes);

// describe('Fuel Quote Form', () => {
//     // POST a new fuel quote
//     test('POST /api/fuelQuoteModule - should create a new fuel quote', async () => {
//         const response = await request(app)
//             .post('/api/fuelQuoteModule')
//             .send({
//                 gallons: 550,
//                 deliveryDate: '2024-05-20'
//                 // Add other required fields here
//             });

//         expect(response.statusCode).toBe(200);
//         // expect(response.body).toHaveProperty('id');
//         expect(response.json).toHaveBeenCalledWith({ message: 'Fuel quote saved successfully' });

//         // expect(response.body).toHaveProperty('gallons', 550);
//         // expect(response.body).toHaveProperty('deliveryDate', '2024-05-20');

//         // Add assertions for other properties of the response body
//     });

//     // POST validation for missing required fields
//     test('POST /api/fuelQuoteModule - Missing required fields results in error', async () => {
//         const response = await request(app)
//             .post('/api/fuelQuoteModule')
//             .send({
//                 // Missing required fields
//             });

//         expect(response.statusCode).toBe(400);
//         // Add assertions for the error response
//     });

//     // POST validation for invalid data
//     test('POST /api/fuelQuoteModule - Invalid data results in error', async () => {
//         const response = await request(app)
//             .post('/api/fuelQuoteModule')
//             .send({
//                 gallons: 'not a number',
//                 deliveryDate: 'invalid date'
//                 // Add other invalid data here
//             });

//         expect(response.statusCode).toBe(400);
//         // Add assertions for the error response
//     });

//     // Add more unit tests for other scenarios as needed
// });
