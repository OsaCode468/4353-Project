const request = require('supertest');
const express = require('express');
const clientProfileRoutes = require('../backend/routes/clientModule');
const pool = require('../backend/connection');

const app = express();
app.use(express.json());
app.use('/api/clientmodule', clientProfileRoutes);

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS client_profiles;')
  await pool.query('CREATE TABLE client_profiles (id SERIAL PRIMARY KEY, full_name VARCHAR(50) NOT NULL, address1 VARCHAR(100) NOT NULL, address2 VARCHAR(100), city VARCHAR(100) NOT NULL, state CHAR(2) NOT NULL, zipcode VARCHAR(9) NOT NULL);');
});

afterAll(async () => {
  await pool.end();
});

describe('Client Profile Management API', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE client_profiles RESTART IDENTITY CASCADE');
  });

  test('Middleware validation - should return error for invalid client profile', async () => {
    const invalidProfile = {
      address1: "123 MLK Blvd St",
      city: "This is a very long city name that exceeds the 100 character limit, which should trigger an error",
      state: "TX",
    };

    const response = await request(app)
      .post('/api/clientmodule/')
      .send(invalidProfile);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation error in one or more fields.');
    expect(response.body.errors).toHaveLength(2);
  });

  test('POST - create a new client profile successfully', async () => {
    const validProfile = {
      fullName: "Raj Singh",
      address1: "123 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };

    const response = await request(app)
      .post('/api/clientmodule/')
      .send(validProfile);

    expect(response.statusCode).toBe(201);
    expect(response.body.full_name).toBe("John Doe");
  });

  test('GET - fetch all client profiles', async () => {
    const response = await request(app).get('/api/clientmodule/');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('PUT - update an existing client profile', async () => {
    let profile = await request(app)
      .post('/api/clientmodule/')
      .send({ fullName: "Jane Doe", address1: "124 Elm St", city: "Smalltown", state: "TX", zipcode: "12345" });

    const updatedProfile = {
      fullName: "Raj Singh",
      address1: "123 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };

    const response = await request(app)
      .put(`/api/clientmodule/${profile.body.id}`)
      .send(updatedProfile);

    expect(response.statusCode).toBe(200);
    expect(response.body.full_name).toBe("Jane Smith");
  });

  test('DELETE - delete a client profile', async () => {
    let profile = await request(app)
      .post('/api/clientmodule/')
      .send({ fullName: "Raj Singh", address1: "123 MLK Blvd", city: "Houston", state: "TX", zipcode: "77024" });

    const response = await request(app).delete(`/api/clientmodule/${profile.body.id}`);
    expect(response.statusCode).toBe(204);
  });

  // GET - handle database error when fetching profiles
  test('GET - handle database error when fetching profiles', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/clientmodule/');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error fetching profiles');
  });

  // POST - handle database error when creating a new profile
  test('POST - handle database error when creating a new profile', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const newProfile = {
      fullName: "Raj Singh",
      address1: "123 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };

    const response = await request(app)
      .post('/api/clientmodule/')
      .send(newProfile);
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error saving profile');
  });

  // PUT - handle non-existing profile update
  test('PUT - handle non-existing profile update', async () => {
    jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const updatedProfile = {
      fullName: "Raj Singh",
      address1: "123 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };

    const response = await request(app)
      .put('/api/clientmodule/1')
      .send(updatedProfile);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Profile not found.');
  });

  // PUT - handle database error during profile update
  test('PUT - handle database error during profile update', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const updatedProfile = {
      fullName: "Raj Singh",
      address1: "123 MLK Blvd",
      city: "Houston",
      state: "TX",
      zipcode: "77024"
    };

    const response = await request(app)
      .put('/api/clientmodule/1')
      .send(updatedProfile);
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error updating profile');
  });

  // DELETE - handle non-existing profile deletion
  test('DELETE - handle non-existing profile deletion', async () => {
    jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app)
      .delete('/api/clientmodule/1');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Profile not found.');
  });

  // DELETE - handle database error during profile deletion
  test('DELETE - handle database error during profile deletion', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .delete('/api/clientmodule/1');
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error deleting profile');
  });
});
