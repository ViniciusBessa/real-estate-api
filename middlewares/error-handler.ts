import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const customError = {
    message: err.message || 'Ocorreu um erro no servidor',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === 'ValidationError') {
    let errors = Object.values(err.errors);
    customError.message = errors.map((error: any) => error.message);
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  else if (err.name === 'CastError') {
    customError.message = `ID ${err.value} é inválido`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  else if (err.code === 11000) {
    let [duplicateField] = Object.keys(err.keyValue);
    let [error] = Object.values(err.keyValue);
    error = `${error} já está em uso`;
    customError.message = { error, duplicateField };
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  res.status(customError.statusCode).json({ err: customError.message });
};

export default errorHandlerMiddleware;
