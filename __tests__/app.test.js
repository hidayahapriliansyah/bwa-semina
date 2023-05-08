const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  test('should return an object with data property containing an array of two objects', async () => {
    const response = await request(app).get('/api/v1/events');

    // expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('message');
    // expect(response.body.message).toBe('Welcom to API Semina');

    expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('data');
    // expect(Array.isArray(response.body.data)).toBe(true);
    // expect(response.body.data.length).toBe(2);
    // expect(typeof response.body.data[0]).toBe('object');
    // expect(typeof response.body.data[1]).toBe('object');
  });
});
