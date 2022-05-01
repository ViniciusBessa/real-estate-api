import { Request, Response, NextFunction } from 'express';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export default authMiddleware;
