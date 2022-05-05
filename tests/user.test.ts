import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';
import User from '../models/User';

describe('User endpoints with a user that is not logged', () => {
  let requestTest: SuperTest<Test> = supertest(app);

  beforeAll(async () => {
    // Connecting to the test database
    await connectDB(process.env.TEST_MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Testing the route GET api/v1/users
  it('GET api/v1/users should fail with error 401', async () => {
    const response = await requestTest.get('/api/v1/users');
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.users).toBeFalsy();
    expect(response.body.numberOfUsers).toBeFalsy();
  });

  // Testing the route GET api/v1/users/:userId
  it('GET api/v1/users/:userId should fail with error 401', async () => {
    const [firstUser] = await User.find();
    const response = await requestTest.get(`/api/v1/users/${firstUser._id}`);
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the route GET api/v1/users/getCurrentUser
  it('GET api/v1/users/getCurrentUser should fail with error 401', async () => {
    const response = await requestTest.get('/api/v1/users/getCurrentUser');
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.user).toBeFalsy();
  });
});

describe('User endpoints with a logged user', () => {
  let requestTest: SuperTest<Test> = supertest(app);
  let userCookie: string;

  beforeAll(async () => {
    // Connecting to the test database
    await connectDB(process.env.TEST_MONGO_URI as string);

    const userData = {
      name: 'JohnSmith',
      email: 'john.smith@gmail.com',
      password: 'password1',
    };

    // Getting the user cookie
    const response = await requestTest
      .post('/api/v1/auth/login')
      .send(userData);
    userCookie = response.headers['set-cookie'];
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Testing the route GET api/v1/users
  it('GET api/v1/users should retrieve all users', async () => {
    const response = await requestTest
      .get('/api/v1/users')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.users).toBeTruthy();
    expect(response.body.numberOfUsers).toBeTruthy();
  });

  // Testing the route GET api/v1/users/:userId
  it('GET api/v1/users/:userId should retrieve the first user', async () => {
    const [firstUser] = await User.find();
    const response = await requestTest
      .get(`/api/v1/users/${firstUser._id}`)
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  // Testing the route GET api/v1/users/getCurrentUser
  it('GET api/v1/users/getCurrentUser should retrieve current user', async () => {
    const response = await requestTest
      .get('/api/v1/users/getCurrentUser')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  // Testing the route PATCH api/v1/users/updateUsername
  it("PATCH api/v1/users/updateUsername should update the user's name", async () => {
    const response = await requestTest
      .patch('/api/v1/users/updateUsername')
      .send({
        name: 'NewUsername',
      })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  it('PATCH api/v1/users/updateUsername should fail to update the name with error 400', async () => {
    const response = await requestTest
      .patch('/api/v1/users/updateUsername')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the route PATCH api/v1/users/updateEmail
  it("PATCH api/v1/users/updateEmail should update the user's email", async () => {
    const response = await requestTest
      .patch('/api/v1/users/updateEmail')
      .send({ email: 'new.email@gmail.com' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  it('PATCH api/v1/users/updateEmail should fail to update the email with 400', async () => {
    const response = await requestTest
      .patch('/api/v1/users/updateEmail')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the route PATCH api/v1/users/updatePassword
  it("PATCH api/v1/users/updatePassword should update the user's password", async () => {
    const response = await requestTest
      .patch('/api/v1/users/updatePassword')
      .send({ currentPassword: 'password1', newPassword: 'password2' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.msg).toBeTruthy();
  });

  it("PATCH api/v1/users/updatePassword should fail because the user didn't pass the current password", async () => {
    const response = await requestTest
      .patch('/api/v1/users/updatePassword')
      .send({ newPassword: 'password2' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBeFalsy();
  });

  it('PATCH api/v1/users/updatePassword should fail because the current password is wrong', async () => {
    const response = await requestTest
      .patch('/api/v1/users/updatePassword')
      .send({ currentPassword: 'wrongpassword', newPassword: 'password3' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBeFalsy();
  });
});
