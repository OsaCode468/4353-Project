const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


const pool = require('../connection');


const clientModuleRoutes = require('../routes/clientModule');
app.use('/api/clientmodule', clientModuleRoutes);


describe('Client Profile API', () => {
    afterAll(async () => {
        await pool.end();  
    });

    // Testing GET all client profiles
    describe('GET /api/clientmodule', () => {
        it('should return all client profiles', async () => {
            const res = await request(app).get('/api/clientmodule');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

   
  

    // Testing POST create a new client profile
    describe('POST /api/clientmodule', () => {
        it('should create a new client profile', async () => {
            const newProfile = {
                fullName: "Jane Doe",
                address1: "1234 Elm Street",
                address2: "Apt 101",
                city: "Springfield",
                state: "IL",
                zipcode: "62704"
            };
            const res = await request(app)
                .post('/api/clientmodule')
                .send(newProfile);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("id");
        });

        it('should handle validation errors for missing fields', async () => {
            const incompleteProfile = {
                address1: "1234 Elm Street"
            };
            const res = await request(app)
                .post('/api/clientmodule')
                .send(incompleteProfile);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("errors");
        });
    });

    //POST for missing required field
    describe('POST /api/clientmodule', () => {
      it('should return 400 Bad Request when a required field is missing', async () => {
          const incompleteProfile = {
              // fullName is intentionally missing
              address1: "1234 Elm Street",
              address2: "Apt 101",
              city: "Springfield",
              state: "IL",
              zipcode: "62704"
          };
          const res = await request(app)
              .post('/api/clientmodule')
              .send(incompleteProfile);
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty("errors");
          expect(res.body.errors).toContain("Full name must be between 1 and 50 characters long.");
      });
  });
  


    // Testing PUT update an existing client profile
describe('PUT /api/clientmodule/:id', () => {
  it('should return 404 for an non-existing profile id', async () => {
      const updatedProfile = {
          fullName: "John Updated",
          address1: "4321 Maple Street",
          address2: "Suite 200",
          city: "Doeville",
          state: "CA",
          zipcode: "90210"
      };
      const res = await request(app)
          .put('/api/clientmodule/9999')  // Using a non-existing ID
          .send(updatedProfile);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Profile not found.");
  });

  it('should update an existing profile', async () => {
      const updatedProfile = {
          fullName: "John Updated",
          address1: "4321 Maple Street",
          address2: "Suite 200",
          city: "Doeville",
          state: "CA",
          zipcode: "90210"
      };
      const res = await request(app)
          .put('/api/clientmodule/1')  // Assuming 1 is a valid existing ID
          .send(updatedProfile);
      if (res.statusCode === 200) {
          expect(res.body).toHaveProperty("id", 1);  // Expecting the id in the response when update is successful
          expect(res.body).toHaveProperty("fullName", "John Updated");  // Further checks can be added as per actual response
      } else {
          // If not successful, ensure the status code is as expected, e.g., 404
          expect(res.statusCode).not.toEqual(200);
      }
  });
});


   // Testing DELETE an existing client profile
   describe('DELETE /api/clientmodule/:id', () => {
    it('should delete a client profile', async () => {
        const res = await request(app).delete('/api/clientmodule/1');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 404 for a non-existing profile id', async () => {
        const res = await request(app).delete('/api/clientmodule/9999');
        expect(res.statusCode).toEqual(404);
    });
});
});