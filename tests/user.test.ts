import { StatusCodes } from 'http-status-codes';
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

  // Testing the getAllUsers route
  it('GET api/v1/user/ should fail with error 401', async () => {
    const response = await requestTest
      .get('/api/v1/user')
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.users).toBeFalsy();
    expect(response.body.numberOfUsers).toBeFalsy();
  });

  // Testing the getSingleUser route
  it('GET api/v1/user/:userId should fail with error 401', async () => {
    const [firstUser] = await User.find();
    const response = await requestTest
      .get(`/api/v1/user/${firstUser._id}`)
    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the getCurrentUser route
  it('GET api/v1/user/getCurrentUser should fail with error 401', async () => {
    const response = await requestTest
      .get('/api/v1/user/getCurrentUser')
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

  // Testing the getAllUsers route
  it('GET api/v1/user/ should retrieve all users', async () => {
    const response = await requestTest
      .get('/api/v1/user')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.users).toBeTruthy();
    expect(response.body.numberOfUsers).toBeTruthy();
  });

  // Testing the getSingleUser route
  it('GET api/v1/user/:userId should retrieve the first user', async () => {
    const [firstUser] = await User.find();
    const response = await requestTest
      .get(`/api/v1/user/${firstUser._id}`)
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  // Testing the getCurrentUser route
  it('GET api/v1/user/getCurrentUser should retrieve current user', async () => {
    const response = await requestTest
      .get('/api/v1/user/getCurrentUser')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  // Testing the updateUsername route
  it("PATCH api/v1/user/updateUsername should update the user's name", async () => {
    const response = await requestTest
      .patch('/api/v1/user/updateUsername')
      .send({
        name: 'NewUsername',
      })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  it('PATCH api/v1/user/updateUsername should fail to update the name with error 400', async () => {
    const response = await requestTest
      .patch('/api/v1/user/updateUsername')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the updateEmail route
  it("PATCH api/v1/user/updateEmail should update the user's email", async () => {
    const response = await requestTest
      .patch('/api/v1/user/updateEmail')
      .send({ email: 'new.email@gmail.com' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
  });

  it('PATCH api/v1/user/updateEmail should fail to update the email with 400', async () => {
    const response = await requestTest
      .patch('/api/v1/user/updateEmail')
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the updatePassword route
  it("PATCH api/v1/user/updatePassword should update the user's password", async () => {
    const response = await requestTest
      .patch('/api/v1/user/updatePassword')
      .send({ currentPassword: 'password1', newPassword: 'password2' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.msg).toBeTruthy();
  });

  it("PATCH api/v1/user/updatePassword should fail because the user didn't pass the current password", async () => {
    const response = await requestTest
      .patch('/api/v1/user/updatePassword')
      .send({ newPassword: 'password2' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBeFalsy();
  });

  it('PATCH api/v1/user/updatePassword should fail because the current password is wrong', async () => {
    const response = await requestTest
      .patch('/api/v1/user/updatePassword')
      .send({ currentPassword: 'wrongpassword', newPassword: 'password3' })
      .set('Cookie', userCookie);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.msg).toBeFalsy();
  });
});
