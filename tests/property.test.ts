import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';

describe('Property Endpoints', () => {
  const requestTest: SuperTest<Test> = supertest(app);
  const firstPropertyId = '62745b5512a234d707653267';
  const secondPropertyId = '62745b5512a234d707653269';
  const wrongPropertyId = '62745b5512a234d70765326e';

  beforeAll(async () => {
    await connectDB(process.env.TEST_MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Property endpoints with a user not logged in', () => {
    // Testing the route GET /api/v1/properties
    it('GET /api/v1/properties should return three properties', async () => {
      const response = await requestTest.get('/api/v1/properties');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(3);
    });

    it('GET /api/v1/properties?title=house+for+sale should return two properties', async () => {
      const response = await requestTest.get(
        '/api/v1/properties?title=house+for+sale'
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(2);
    });

    // Testing the route GET /api/v1/properties/:propertyId
    it('GET /api/v1/properties/:propertyId should return one property', async () => {
      const response = await requestTest.get(
        `/api/v1/properties/${firstPropertyId}`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.property).toBeTruthy();
    });

    it('GET /api/v1/properties/:propertyId should fail to return a property with error 404', async () => {
      const response = await requestTest.get(
        `/api/v1/properties/${wrongPropertyId}`
      );
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.property).toBeFalsy();
    });

    it('GET /api/v1/properties/:propertyId should fail to return a property with error 400', async () => {
      const response = await requestTest.get(`/api/v1/properties/badId`);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route GET /api/v1/properties/user/:userId
    it('GET /api/v1/properties/user/:userId should return all announces of one user', async () => {
      const response = await requestTest.get(
        '/api/v1/properties/user/6274554605ebef471497257e'
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(1);
    });

    // Testing the route POST /api/v1/properties
    it('POST /api/v1/properties should fail with error 401', async () => {
      const response = await requestTest.post('/api/v1/properties').send({
        title: 'House for rent!',
        description: 'A good house',
        price: 1000,
        location: '62735070d47b87fb917de79b',
        announcer: '6274554605ebef471497257e',
        announceType: 'rent',
        numberBedrooms: 5,
        numberBathrooms: 2,
        images: ['randomImageUrl.com'],
      });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/properties/:propertyId
    it('PATCH /api/v1/properties/:propertyId should fail with error 401', async () => {
      const response = await requestTest
        .patch(`/api/v1/properties/${firstPropertyId}`)
        .send({ price: 300000 });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/properties/:propertyId
    it('DELETE /api/v1/properties/:propertyId should fail with error 401', async () => {
      const response = await requestTest.delete(
        `/api/v1/properties/${secondPropertyId}`
      );
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.property).toBeFalsy();
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

    // Testing the route GET /api/v1/properties
    it('GET /api/v1/properties should return three properties', async () => {
      const response = await requestTest.get('/api/v1/properties');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(3);
    });

    it('GET /api/v1/properties?title=house+for+sale should return two properties', async () => {
      const response = await requestTest.get(
        '/api/v1/properties?title=house+for+sale'
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(2);
    });

    // Testing the route GET /api/v1/properties/:propertyId
    it('GET /api/v1/properties/:propertyId should return one property', async () => {
      const response = await requestTest.get(
        `/api/v1/properties/${firstPropertyId}`
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.property).toBeTruthy();
    });

    it('GET /api/v1/properties/:propertyId should fail to return a property with error 404', async () => {
      const response = await requestTest.get(
        `/api/v1/properties/${wrongPropertyId}`
      );
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.property).toBeFalsy();
    });

    it('GET /api/v1/properties/:propertyId should fail to return a property with error 400', async () => {
      const response = await requestTest.get(`/api/v1/properties/badId`);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route GET /api/v1/properties/user/:userId
    it('GET /api/v1/properties/user/:userId should return all announces of one user', async () => {
      const response = await requestTest.get(
        '/api/v1/properties/user/6274554605ebef471497257e'
      );
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.properties).toBeTruthy();
      expect(response.body.numberOfProperties).toBe(1);
    });

    // Testing the route POST /api/v1/properties
    it('POST /api/v1/properties should create and return a property', async () => {
      const response = await requestTest
        .post('/api/v1/properties')
        .send({
          title: 'House for rent!',
          description: 'A good house',
          price: 1000,
          location: '62735070d47b87fb917de79f',
          announcer: '6274554605ebef471497257e',
          announceType: 'rent',
          numberBedrooms: 5,
          numberBathrooms: 2,
          images: ['randomImageUrl.com'],
        })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body.property).toBeTruthy();
    });

    it('POST /api/v1/properties should fail to create a new property with error 400', async () => {
      const response = await requestTest
        .post('/api/v1/properties')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/properties/:propertyId
    it('PATCH /api/v1/properties/:propertyId should update and return one property', async () => {
      const response = await requestTest
        .patch(`/api/v1/properties/${firstPropertyId}`)
        .send({ price: 300000 })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.property).toBeTruthy();
      expect(response.body.property.price).toBe(300000);
    });

    it('PATCH /api/v1/properties/:propertyId should fail to update a property with error 404', async () => {
      const response = await requestTest
        .patch(`/api/v1/properties/${wrongPropertyId}`)
        .send({ price: 300000 })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.property).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/properties/:propertyId
    it('DELETE /api/v1/properties/:propertyId should delete and return one property', async () => {
      const response = await requestTest
        .delete(`/api/v1/properties/${secondPropertyId}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.property).toBeTruthy();
    });

    it('DELETE /api/v1/properties/:propertyId should fail to delete a property with error 404', async () => {
      const response = await requestTest
        .delete(`/api/v1/properties/${wrongPropertyId}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.property).toBeFalsy();
    });
  });
});
