import connectDB from './db';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User';
import Location from '../models/Location';
import jsonUsers from './seeds/users.json';
import jsonLocations from './seeds/locations.json';

const resetTestDB = async () => {
  // Connecting to the testing database
  await connectDB(process.env.TEST_MONGO_URI as string);

  // Deleting all users and inserting the testing data
  await User.deleteMany();
  await User.create(jsonUsers);

  // Deleting all locations and inserting the testing data
  await Location.deleteMany();
  await Location.create(jsonLocations);
  process.exit(0);
};

resetTestDB();
