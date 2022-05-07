import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';
import User from '../models/User';

describe('User Endpoints', () => {
  beforeAll(async () => {
    // Connecting to the test database
    await connectDB(process.env.TEST_MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User endpoints with a user that is not logged', () => {
    const requestTest: SuperTest<Test> = supertest(app);

    // Testing the route GET /api/v1/users
    it('GET /api/v1/users should fail with error 401', async () => {
      const response = await requestTest.get('/api/v1/users');
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.users).toBeFalsy();
      expect(response.body.numberOfUsers).toBeFalsy();
    });

    // Testing the route GET /api/v1/users/:userId
    it('GET /api/v1/users/:userId should fail with error 401', async () => {
      const [firstUser] = await User.find();
      const response = await requestTest.get(`/api/v1/users/${firstUser._id}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/currentUser
    it('GET /api/v1/users/currentUser should fail with error 401', async () => {
      const response = await requestTest.get('/api/v1/users/currentUser');
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route GET /api/v1/users/currentUser/propertiesFavorited
    it('GET /api/v1/users/currentUser/propertiesFavorited should fail with error 401', async () => {
      const response = await requestTest.get(
        '/api/v1/users/currentUser/propertiesFavorited'
      );
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.favorites).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/:propertyId
    it('PATCH /api/v1/users/currentUser/:propertyId should fail with error 401', async () => {
      const response = await requestTest.patch(
        '/api/v1/users/currentUser/62745b5512a234d707653267'
      );
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/users/currentUser/:propertyId
    it('DELETE /api/v1/users/currentUser/:propertyId should fail with error 401', async () => {
      const response = await requestTest.delete(
        '/api/v1/users/currentUser/62745b5512a234d707653267'
      );
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/username
    it('PATCH /api/v1/users/currentUser/username should fail with error 401', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/username')
        .send({
          name: 'NewUsername',
        });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/email
    it('PATCH /api/v1/users/currentUser/email should fail with error 401', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/email')
        .send({ email: 'new.email@gmail.com' });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/password
    it('PATCH /api/v1/users/currentUser/password should fail with error 401', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ currentPassword: 'password1', newPassword: 'password2' });
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.msg).toBeFalsy();
    });
  });

  describe('User endpoints with a logged user', () => {
    const requestTest: SuperTest<Test> = supertest(app);
    let userCookie: string;

    beforeAll(async () => {
      const userData = {
        email: 'john.smith@gmail.com',
        password: 'password1',
      };

      // Getting the user cookie
      const response = await requestTest
        .post('/api/v1/auth/login')
        .send(userData);
      userCookie = response.headers['set-cookie'];
    });

    // Testing the route GET /api/v1/users
    it('GET /api/v1/users should fail to retrieve all users with error 403', async () => {
      const response = await requestTest
        .get('/api/v1/users')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
      expect(response.body.users).toBeFalsy();
      expect(response.body.numberOfUsers).toBeFalsy();
    });

    // Testing the route GET /api/v1/users/:userId
    it('GET /api/v1/users/:userId should retrieve the first user', async () => {
      const [firstUser] = await User.find();
      const response = await requestTest
        .get(`/api/v1/users/${firstUser._id}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/currentUser
    it('GET /api/v1/users/currentUser should retrieve current user', async () => {
      const response = await requestTest
        .get('/api/v1/users/currentUser')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/currentUser/propertiesFavorited
    it('GET /api/v1/users/currentUser/propertiesFavorited should return all properties favorited by the user', async () => {
      const response = await requestTest
        .get('/api/v1/users/currentUser/propertiesFavorited')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.favorites).toBeTruthy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/:propertyId
    it('PATCH /api/v1/users/currentUser/:propertyId should favorite the property selected by the user', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/62745b5512a234d707653268')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/:propertyId should fail to favorite a property with error 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/badId')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/users/currentUser/:propertyId
    it("DELETE /api/v1/users/currentUser/:propertyId should remove the property from the user's favorties", async () => {
      const response = await requestTest
        .delete('/api/v1/users/currentUser/62745b5512a234d707653267')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('DELETE /api/v1/users/currentUser/:propertyId should fail to remove a property with error 400', async () => {
      const response = await requestTest
        .delete('/api/v1/users/currentUser/badId')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route /api/v1/users/currentUser/username
    it("PATCH /api/v1/users/currentUser/username should update the user's name", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/username')
        .send({
          name: 'NewUsername',
        })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/username should fail to update the name with error 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/username')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/email
    it("PATCH /api/v1/users/currentUser/email should update the user's email", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/email')
        .send({ email: 'new.email@gmail.com' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/email should fail to update the email with 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/email')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/password
    it("PATCH /api/v1/users/currentUser/password should update the user's password", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ currentPassword: 'password1', newPassword: 'password2' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.msg).toBeTruthy();
    });

    it("PATCH /api/v1/users/currentUser/password should fail because the user didn't pass the current password", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ newPassword: 'password2' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.msg).toBeFalsy();
    });

    it('PATCH /api/v1/users/currentUser/password should fail because the current password is wrong', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ currentPassword: 'wrongpassword', newPassword: 'password3' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.msg).toBeFalsy();
    });
  });

  describe('User endpoints with a admin', () => {
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

    // Testing the route GET /api/v1/users
    it('GET /api/v1/users should retrieve all users', async () => {
      const response = await requestTest
        .get('/api/v1/users')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.users).toBeTruthy();
      expect(response.body.numberOfUsers).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/:userId
    it('GET /api/v1/users/:userId should retrieve the first user', async () => {
      const [firstUser] = await User.find();
      const response = await requestTest
        .get(`/api/v1/users/${firstUser._id}`)
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/currentUser
    it('GET /api/v1/users/currentUser should retrieve current user', async () => {
      const response = await requestTest
        .get('/api/v1/users/currentUser')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    // Testing the route GET /api/v1/users/currentUser/propertiesFavorited
    it('GET /api/v1/users/currentUser/propertiesFavorited should return all properties favorited by the user', async () => {
      const response = await requestTest
        .get('/api/v1/users/currentUser/propertiesFavorited')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.favorites).toBeTruthy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/:propertyId
    it('PATCH /api/v1/users/currentUser/:propertyId should favorite the property selected by the user', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/62745b5512a234d707653268')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/:propertyId should fail to favorite a property with error 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/badId')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route DELETE /api/v1/users/currentUser/:propertyId
    it("DELETE /api/v1/users/currentUser/:propertyId should remove the property from the user's favorties", async () => {
      const response = await requestTest
        .delete('/api/v1/users/currentUser/62745b5512a234d707653267')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('DELETE /api/v1/users/currentUser/:propertyId should fail to remove a property with error 400', async () => {
      const response = await requestTest
        .delete('/api/v1/users/currentUser/badId')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/username
    it("PATCH /api/v1/users/currentUser/username should update the user's name", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/username')
        .send({
          name: 'NewUsername2',
        })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/username should fail to update the name with error 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/username')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/email
    it("PATCH /api/v1/users/currentUser/email should update the user's email", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/email')
        .send({ email: 'new.email2@gmail.com' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.user).toBeTruthy();
    });

    it('PATCH /api/v1/users/currentUser/email should fail to update the email with 400', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/email')
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.user).toBeFalsy();
    });

    // Testing the route PATCH /api/v1/users/currentUser/password
    it("PATCH /api/v1/users/currentUser/password should update the user's password", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ currentPassword: 'password2', newPassword: 'password3' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.msg).toBeTruthy();
    });

    it("PATCH /api/v1/users/currentUser/password should fail because the user didn't pass the current password", async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ newPassword: 'password2' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.msg).toBeFalsy();
    });

    it('PATCH /api/v1/users/currentUser/password should fail because the current password is wrong', async () => {
      const response = await requestTest
        .patch('/api/v1/users/currentUser/password')
        .send({ currentPassword: 'wrongpassword', newPassword: 'password3' })
        .set('Cookie', userCookie);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.msg).toBeFalsy();
    });
  });
});
