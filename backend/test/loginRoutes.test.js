const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const router = require('../routes/login')
const client = require("../connection")
// jest.mock('bcrypt');


describe('Express Routes', () => {
  let app;

  beforeEach( () => {
    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  describe('POST /login', () => {
    it('should return 400 if username or password is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 if username does not exist', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'nonexistent', password: 'password' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if password does not exist', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'existingUsername', password: 'nonexistent' });
      expect(res.status).toBe(400);
    });

    it('should return 200 and jsonwebtoken if credentials are correct', async () => {
      // Mocking the behavior of your dummyuser and dummypass arrays
      const pool = await client.connect()
      await pool.query("DROP TABLE USERS")
      await pool.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)")
      const ress = await request(app)
      .post('/')
      .send({ username: 'existingUsername', password: 'password' });
      const res = await request(app)
        .post('/login')
        .send({ username: 'existingUsername', password: 'password' });
      console.log(res.body)
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('jsonwebtoken');
    });
  });

  describe('POST /', () => {
    it('should return 400 if username or password is missing', async () => {
      const res = await request(app)
        .post('/')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should create a new user and return 200 with username and hashed password', async () => {
      const res = await request(app)
        .post('/')
        .send({ username: 'newUser', password: 'newPassword' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('username');

    });
  });
});
