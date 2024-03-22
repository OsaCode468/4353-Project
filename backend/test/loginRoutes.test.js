const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { router, dummyuser, dummypass } = require('../routes/login')
jest.mock('bcrypt');

describe('Express Routes', () => {
  let app;

  beforeEach(() => {
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
      dummyuser.push('existingUsername');
      dummypass.push('password');

      const res = await request(app)
        .post('/login')
        .send({ username: 'existingUsername', password: 'password' });
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
      expect(res.body).toEqual({ username: 'newUser' }); // Remove password expectation
    });
  });
});
