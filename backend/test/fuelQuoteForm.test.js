const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routes/fuelQuoteModule'); 
const db = require('../connection');

jest.mock('../connection', () => {
    return {
        connect: jest.fn().mockResolvedValue({
            query: jest.fn(),
            release: jest.fn(),
        }),
    };
});

const app = express();
app.use(bodyParser.json());
app.use(router);

describe('API Routes', () => {
    beforeAll(() => {
        db.connect.mockImplementation(() => Promise.resolve({
            query: jest.fn().mockResolvedValueOnce({
                rows: [{ id: 1, address1: '123 Test Lane', city: 'Testville', state: 'TS', zipcode: '12345' }],
                rowCount: 1
            }),
            release: jest.fn()
        }));
    });

    test('GET /getID/:username should return user ID', async () => {
        const response = await request(app).get('/getID/johndoe');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1 });
    });

    test('GET /getAddress/:id should return address information', async () => {
        const response = await request(app).get('/getAddress/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            address: '123 Test Lane',
            city: 'Testville',
            state: 'TS',
            zipcode: '12345'
        });
    });

    test('POST / should save fuel quote', async () => {
        db.connect.mockResolvedValueOnce({
            query: jest.fn().mockResolvedValue({ rowCount: 1 }),
            release: jest.fn()
        });

        const payload = {
            gallons: 500,
            deliveryAddress: '123 Test Lane',
            deliveryDate: '2021-09-01',
            id: 1,
            priceG: 2.50,
            totalAmount: 1250
        };

        const response = await request(app).post('/').send(payload);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Fuel quote saved successfully' });
    });

    test('POST / should return 400 for invalid data', async () => {
        const payload = { gallons: 'five hundred', deliveryDate: '2021-09-01' }; // Invalid gallons
        const response = await request(app).post('/').send(payload);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Gallons requested must be a numeric value');
    });
});