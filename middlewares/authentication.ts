import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.signedCookies;

  if (!token) {
    return next();
  }
  try {
    const userInfo = verifyToken(token);
    req.user = userInfo;
    next();
  } catch (error) {
    next();
  }
};

export default authMiddleware;
