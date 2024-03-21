const request = require('supertest');
const express = require('express');
const clientProfileRoutes = require('../backend/routes/clientModule'); 


const app = express();
app.use(express.json());
app.use('/api/clientmodule', clientProfileRoutes); 

describe('Client Profile Management', () => {
 // GET all profiles ==== GET_UNIT_TEST
 test('GET /api/clientmodule/ - should retrieve all client profiles', async () => {
    const response = await request(app)
      .get('/api/clientmodule/');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    
  });

  // POST a new profile ===== POST_UNIT_TEST_1
  test('POST /api/clientmodule/ - should create a new client profile', async () => {
    const response = await request(app)
      .post('/api/clientmodule/')
      .send({
        fullName: "Raj Singh",
        address1: "4300 MLK Blvd",
        city: "Houston",
        state: "TX",
        zipcode: "77024"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('fullName', 'Raj Singh');
    
  });

  //POST validation for missing required fields ==== POST_UNIT_TEST_2
  test('POST /api/clientmodule/ - Missing required fields results in error', async () => {
    const response = await request(app)
      .post('/api/clientmodule/')
      .send({
        state: "TX",
        zipcode: "77024"
        // Missing fullName, address1, and city
      });
  
    expect(response.statusCode).toBe(400);
    const errorMessages = response.body.errors;
    const combinedErrorMessage = errorMessages.join(" "); 
  
    expect(combinedErrorMessage).toMatch(/Full name/);
    expect(combinedErrorMessage).toMatch(/Address 1/);
    expect(combinedErrorMessage).toMatch(/City/);
  });
  
    
  //POST: Testing for Address2 validation with invalid data, should return an error ==== POST_UNIT_TEST_3
  test('POST /api/clientmodule/ - Address2 validation (optional field)', async () => {
    const profileWithLongAddress2 = {
      fullName: "Raj Singh",
      address1: "4300 MLK Blvd",
      address2: "A".repeat(101), // 101 characters long, exceeding the limit, for testing purposes
      city: "Houston",
      state: "TX",
      zipcode: "77024"
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
  

  // POST with invalid data, in this case it is fullName ==== POST_UNIT_TEST_4
  test('POST /api/clientmodule/ - should validate profile data', async () => {
    const invalidProfileData = {
      fullName: "", // Invalid because it's empty, for testing purposes
      address1: "4300 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };
    const response = await request(app)
      .post('/api/clientmodule/')
      .send(invalidProfileData);

    expect(response.statusCode).toBe(400);
    // Checking for error messages in the response body
    expect(response.body.errors).toBeDefined();
  });


  //POST test for invalid zipcode ==== POST_UNIT_TEST_5
  test('POST /api/clientmodule/ - should reject profile with invalid zipcode', async () => {
    const profileWithInvalidZipcode = {
      fullName: "Raj Singh",
      address1: "4300 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "123" // Invalid zipcode, for testing purposes
    };
  
    const response = await request(app)
      .post('/api/clientmodule/')
      .send(profileWithInvalidZipcode);
  
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContain("Zipcode must be a valid 5 or 9 digit code.");
  });
  

  //POST test for invalid state code ==== POST_UNIT_TEST_6
  test('POST /api/clientmodule/ - should reject profile with invalid state code', async () => {
    const profileWithInvalidState = {
      fullName: "Raj Singh",
      address1: "4300 MLK Blvd",
      city: "Houston",
      state: "UHMC", // Invalid state code, for testing purposes
      zipcode: "77204"
    };
  
    const response = await request(app)
      .post('/api/clientmodule/')
      .send(profileWithInvalidState);
  
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContain("State must be exactly 2 characters long.");
  });


  // PUT test for a profile, we assume that a profile with ID 1 exists ==== PUT_UNIT_TEST_1
  test('PUT /api/clientmodule/1 - should update the profile with ID 1', async () => {
    const updatedData = {   
      fullName: "Raj Singh",    
      address1: "4300 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };
    const response = await request(app)
      .put('/api/clientmodule/1')
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('fullName', 'Raj Singh');
    
  });

  //PUT test for retrieving a profile that does not exist, should return "Profile not found" ==== PUT_UNIT_TEST_2
  test('PUT /api/clientmodule/:id - should return "Profile not found" for non-existing profile', async () => {
    const nonExistentId = 9999; //9999 is an ID that is unlikely to exist, for testing purposes
    const profileUpdate = {
      fullName: "Raj Singh",
      address1: "4300 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };
  
    const response = await request(app)
      .put(`/api/clientmodule/${nonExistentId}`)
      .send(profileUpdate);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Profile not found." });
  });

  
  
// DELETE a profile (assumes that a profile with ID 1 exists) ==== DELETE_UNIT_TEST_1
test('DELETE /api/clientmodule/1 - should delete the profile with ID 1', async () => {
    const response = await request(app)
      .delete('/api/clientmodule/1');

    expect(response.statusCode).toBe(204);
  });


  //DELETE test for deleting a profile that does not exist, should return "Profile not found" ==== DELETE_UNIT_TEST_2
  test('DELETE /api/clientmodule/:id - should return "Profile not found" for non-existing profile', async () => {
    const nonExistentId = 9999; //ID that is unlikely to exist
    const response = await request(app)
      .delete(`/api/clientmodule/${nonExistentId}`);
  
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Profile not found." });
  });

  
  
  

});
