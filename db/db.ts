import mongoose from 'mongoose';

const connectDB = (uri: string) => {
  mongoose.connect(uri);
};

export default connectDB;
