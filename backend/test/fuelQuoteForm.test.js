const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const fuelRouter = require('../routes/fuelQuoteModule');

const app = express();

app.use(bodyParser.json());

app.use('/fuel', fuelRouter);

describe('POST /fuel', () => {
    test('should respond with status 200 and a success message when valid data is provided', async () => {
        const response = await request(app)
            .post('/fuel')
            .send({ gallons: 100, deliveryDate: '2024-03-29' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Fuel quote saved successfully');
        expect(response.body.fuelQuote).toEqual(expect.objectContaining({
            deliveryDate: '2024-03-29',
            gallons: 100,
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




