import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';

describe('Location Endpoints', () => {
  let requestTest: SuperTest<Test> = supertest(app);
  const firstLocationId = '62735070d47b87fb917de79e';
  const secondLocationId = '62735070d47b87fb917de79d';
  const wrongLocationId = '62735070d47b87fb917de793';

  beforeAll(async () => {
    // Connecting to the test database
    await connectDB(process.env.TEST_MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Testing the route GET /api/v1/locations
  it('GET /api/v1/locations should return five locations', async () => {
    const response = await requestTest.get('/api/v1/locations');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.locations).toBeTruthy();
    expect(response.body.numberOfLocations).toBe(5);
  });

  it('GET /api/v1/locations?city=rio should return two locations', async () => {
    const response = await requestTest.get('/api/v1/locations?city=rio');
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.locations).toBeTruthy();
    expect(response.body.numberOfLocations).toBe(2);
  });

  // Testing the route GET /api/v1/locations/:locationId
  it('GET /api/v1/locations/:locationId should return one location', async () => {
    const response = await requestTest.get(
      `/api/v1/locations/${firstLocationId}`
    );
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.location).toBeTruthy();
  });

  it('GET /api/v1/locations/:locationId should fail to return a location with error 404', async () => {
    const response = await requestTest.get(
      `/api/v1/locations/${wrongLocationId}`
    );
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.location).toBeFalsy();
  });

  it('GET /api/v1/locations/:locationId should fail to return a location with error 400', async () => {
    const response = await requestTest.get(`/api/v1/locations/badId`);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.location).toBeFalsy();
  });

  // Testing the route POST /api/v1/locations
  it('POST /api/v1/locations should create a new location', async () => {
    const response = await requestTest
      .post('/api/v1/locations')
      .send({ state: 'Minas Gerais', city: 'Belo Horizonte' });
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body.location).toBeTruthy();
  });

  it('POST /api/v1/locations should fail to create a location with error 400', async () => {
    const response = await requestTest.post('/api/v1/locations');
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.location).toBeFalsy();
    expect(response.body.err).toHaveLength(2);
  });

  // Testing the route PATCH /api/v1/locations/:locationId
  it('PATCH /api/v1/locations/:locationId should return one location', async () => {
    const response = await requestTest
      .patch(`/api/v1/locations/${firstLocationId}`)
      .send({ city: 'Parintins' });
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.location).toBeTruthy();
  });

  it('PATCH /api/v1/locations/:locationId should fail to return a location with error 404', async () => {
    const response = await requestTest
      .patch(`/api/v1/locations/${wrongLocationId}`)
      .send({ city: 'Parintins' });
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.location).toBeFalsy();
  });

  // Testing the route DELETE /api/v1/locations/:locationId
  it('DELETE /api/v1/locations/:locationId should delete a location', async () => {
    const response = await requestTest.delete(
      `/api/v1/locations/${secondLocationId}`
    );
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.location).toBeTruthy();
  });

  it('DELETE /api/v1/locations/:locationId should fail to delete a location with error 404', async () => {
    const response = await requestTest.delete(
      `/api/v1/locations/${wrongLocationId}`
    );
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.location).toBeFalsy();
  });
});
