import app from './app';

const port = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(port, () =>
    console.log(`The server is listening on port ${port}`)
  );
};

startServer();
