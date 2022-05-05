import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import connectDB from '../db/db';

describe('Auth endpoints', () => {
  const requestTest: SuperTest<Test> = supertest(app);

  beforeAll(async () => {
    // Connecting to the test database
    await connectDB(process.env.TEST_MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Testing the register route
  it('POST /api/v1/auth/register should register a new user', async () => {
    const response = await requestTest.post('/api/v1/auth/register').send({
      name: 'EbbaTatianus',
      email: 'ebba.tatianus@gmail.com',
      password: 'ebbat',
    });
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body.user).toBeTruthy();
    expect(response.headers['set-cookie']).toBeTruthy();
  });

  it("POST /api/v1/auth/register should fail with error 400 because a email wasn't passed ", async () => {
    const response = await requestTest.post('/api/v1/auth/register').send({
      name: 'YellenaWebbert',
      password: 'yellenaw',
    });
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the login route
  it('POST api/v1/auth/login should successfully log in the user', async () => {
    const response = await requestTest.post('/api/v1/auth/login').send({
      email: 'clara.gala@gmail.com',
      password: 'clarag',
    });
    expect(response.statusCode).toBe(StatusCodes.OK);
    expect(response.body.user).toBeTruthy();
    expect(response.headers['set-cookie']).toBeTruthy();
  });

  it("POST /api/v1/auth/login should fail with error 400 because a email wasn't passed ", async () => {
    const response = await requestTest.post('/api/v1/auth/login').send({
      password: 'clarag',
    });
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  it("POST api/v1/auth/login should fail with error 404 because the user wasn't found", async () => {
    const response = await requestTest.post('/api/v1/auth/login').send({
      email: 'clara@gmail.com',
      password: 'clarag',
    });
    expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.user).toBeFalsy();
  });

  it('POST api/v1/auth/login should fail with error 400 because the password is wrong', async () => {
    const response = await requestTest.post('/api/v1/auth/login').send({
      email: 'clara.gala@gmail.com',
      password: 'clara',
    });
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.user).toBeFalsy();
  });

  // Testing the logout route
  it('GET api/v1/auth/logout should successfully log out the user', async () => {
    const response = await requestTest.get('/api/v1/auth/logout');
    expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
  });
});
