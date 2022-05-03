import connectDB from './db';
import dotenv from 'dotenv';
import User from '../models/User';
dotenv.config();

const resetTestDB = async () => {
  await connectDB(process.env.TEST_MONGO_URI as string);
  await User.deleteMany({});
  await User.create(
    {
      name: 'ClaraGala',
      email: 'clara.gala@gmail.com',
      password: 'clarag',
    },
    {
      name: 'JohnSmith',
      email: 'john.smith@gmail.com',
      password: 'password1',
    }
  );
  process.exit(0);
};

resetTestDB();
