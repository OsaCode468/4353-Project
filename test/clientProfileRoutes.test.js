const request = require('supertest');
const express = require('express');
const clientProfileRoutes = require('../backend/routes/clientModule'); 

const app = express();
app.use(express.json());
app.use('/api/clientmodule', clientProfileRoutes); 

describe('Client Profile Management', () => {
  // POST a new profile
  test('POST /api/clientmodule/ - should create a new client profile', async () => {
    const response = await request(app)
      .post('/api/clientmodule/')
      .send({
        fullName: "Test User",
        address1: "123 Test St",
        city: "Testville",
        state: "TS",
        zipcode: "12345"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('fullName', 'Test User');
    // Add more assertions as needed
  });

  // GET all profiles
  test('GET /api/clientmodule/ - should retrieve all client profiles', async () => {
    const response = await request(app)
      .get('/api/clientmodule/');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    
  });



  // PUT (update) a profile (assumes that a profile with ID 1 exists)
  test('PUT /api/clientmodule/1 - should update the profile with ID 1', async () => {
    const updatedData = {
      fullName: "Updated User",
      address1: "123 Updated St",
      city: "Updateville",
      state: "UP",
      zipcode: "54321"
    };
    const response = await request(app)
      .put('/api/clientmodule/1')
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('fullName', 'Updated User');
    
  });

  // DELETE a profile (assumes that a profile with ID 1 exists)
  test('DELETE /api/clientmodule/1 - should delete the profile with ID 1', async () => {
    const response = await request(app)
      .delete('/api/clientmodule/1');

    expect(response.statusCode).toBe(204);
  });


 
  //POST validation for missing required fields
  test('POST /api/clientmodule/ - Missing required fields results in error', async () => {
    const response = await request(app)
      .post('/api/clientmodule/')
      .send({
        state: "TX",
        zipcode: "12345"
        // Missing fullName, address1, and city
      });
  
    expect(response.statusCode).toBe(400);
    const errorMessages = response.body.errors;
    const combinedErrorMessage = errorMessages.join(" "); 
  
    // Check for presence of specific error messages in the combined string
    expect(combinedErrorMessage).toMatch(/Full name/);
    expect(combinedErrorMessage).toMatch(/Address 1/);
    expect(combinedErrorMessage).toMatch(/City/);
  });
  
  

    
  //POST: Testing for Address2 validation with invalid data, should return an error
  test('POST /api/clientmodule/ - Address2 validation (optional field)', async () => {
    const profileWithLongAddress2 = {
      fullName: "John Doe",
      address1: "123 Main St",
      address2: "A".repeat(101), // 101 characters long, exceeding the limit
      city: "Anytown",
      state: "TX",
      zipcode: "12345"
    };
    const response = await request(app)
      .post('/api/clientmodule/')
      .send(profileWithLongAddress2);
  
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        "Address 2 must not exceed 100 characters."
      ])
    );
  });
  



  // POST with invalid data
  test('POST /api/clientmodule/ - should validate profile data', async () => {
    const invalidProfileData = {
      fullName: "", // Invalid because it's empty
      address1: "123 Test St",
      city: "Testville",
      state: "TS",
      zipcode: "12345"
    };
    const response = await request(app)
      .post('/api/clientmodule/')
      .send(invalidProfileData);

    expect(response.statusCode).toBe(400);
    // Check for error messages in the response body
    expect(response.body.errors).toBeDefined();
  });

});
