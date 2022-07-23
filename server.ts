import app from './app';
import connectDB from './db/db';

const port = process.env.PORT || 5000;
const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    await connectDB(process.env.MONGO_URI as string);
  } else {
    await connectDB(process.env.TEST_MONGO_URI as string);
  }
  app.listen(port, () =>
    console.log(`The server is listening on port ${port}`)
  );
};

startServer();
