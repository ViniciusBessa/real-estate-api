import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';

describe('Location Endpoints', () => {
  const requestTest: SuperTest<Test> = supertest(app);
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

  describe('Location endpoints with a user that is not logged', () => {
    // Testing the route GET /api/v1/locations
    it('GET /api/v1/locations should return all locations', async () => {
      const response = await requestTest.get('/api/v1/locations');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.locations).toBeTruthy();
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

    // Testing the route GET /api/v1/locations/states
    it('GET /api/v1/locations/states should return all the states', async () => {
      const response = await requestTest.get('/api/v1/locations/states');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.states).toBeTruthy();
    });

    // Testing the route GET /api/v1/locations/cities/:state
    it('GET /api/v1/locations/cities/:state should return all cities from one state', async () => {
      const response = await requestTest.get('/api/v1/locations/cities/rio');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.cities).toBeTruthy();
      expect(response.body.numberOfCities).toBe(2);
    });

    // Testing the route POST /api/v1/locations
    it('POST /api/v1/locations should fail with error 401', async () => {
      const response = await requestTest
        .post('/api/v1/locations')
        .send({ state: 'Minas Gerais', city: 'Belo Horizonte' });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.location).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/locations/:locationId
    it('PATCH /api/v1/locations/:locationId should fail with error 401', async () => {
      const response = await requestTest
        .patch(`/api/v1/locations/${firstLocationId}`)
        .send({ city: 'Parintins' });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.location).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/locations/:locationId
    it('DELETE /api/v1/locations/:locationId should fail with error 401', async () => {
      const response = await requestTest.delete(
        `/api/v1/locations/${secondLocationId}`
      );
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.location).toBeFalsy();
    });
  });

  describe('Location endpoints with a admin', () => {
    const requestTest: SuperTest<Test> = supertest(app);
    let userCookie: string;

    beforeAll(async () => {
      const userData = {
        email: 'michael.alley@gmail.com',
        password: 'password2',
      };

      // Getting the user cookie
      const response = await requestTest
        .post('/api/v1/auth/login')
        .send(userData);
      userCookie = response.headers['set-cookie'];
    });

    // Testing the route GET /api/v1/locations
    it('GET /api/v1/locations should return all locations', async () => {
      const response = await requestTest.get('/api/v1/locations');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.locations).toBeTruthy();
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

    // Testing the route GET /api/v1/locations/states
    it('GET /api/v1/locations/states should return all the states', async () => {
      const response = await requestTest.get('/api/v1/locations/states');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.states).toBeTruthy();
    });

    // Testing the route GET /api/v1/locations/cities/:state
    it('GET /api/v1/locations/cities/:state should return all cities from one state', async () => {
      const response = await requestTest.get('/api/v1/locations/cities/acre');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.cities).toBeTruthy();
      expect(response.body.numberOfCities).toBe(1);
    });

    // Testing the route POST /api/v1/locations
    it('POST /api/v1/locations should create and return a new location', async () => {
      const response = await requestTest
        .post('/api/v1/locations')
        .send({ state: 'Minas Gerais', city: 'Belo Horizonte' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body.location).toBeTruthy();
    });

    it('POST /api/v1/locations should fail to create a location with error 400', async () => {
      const response = await requestTest
        .post('/api/v1/locations')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.location).toBeFalsy();
      expect(response.body.err).toHaveLength(2);
    });

    // Testing the route PATCH /api/v1/locations/:locationId
    it('PATCH /api/v1/locations/:locationId should update and return one location', async () => {
      const response = await requestTest
        .patch(`/api/v1/locations/${firstLocationId}`)
        .send({ city: 'Parintins' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.location).toBeTruthy();
    });

    it('PATCH /api/v1/locations/:locationId should fail to update a location with error 404', async () => {
      const response = await requestTest
        .patch(`/api/v1/locations/${wrongLocationId}`)
        .send({ city: 'Parintins' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.location).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/locations/:locationId
    it('DELETE /api/v1/locations/:locationId should delete and return one location', async () => {
      const response = await requestTest
        .delete(`/api/v1/locations/${secondLocationId}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.location).toBeTruthy();
    });

    it('DELETE /api/v1/locations/:locationId should fail to delete a location with error 404', async () => {
      const response = await requestTest
        .delete(`/api/v1/locations/${wrongLocationId}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.location).toBeFalsy();
    });
  });
});
