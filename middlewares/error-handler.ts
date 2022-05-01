import { Errback, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

export default errorHandlerMiddleware;
