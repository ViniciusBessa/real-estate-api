import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';

const restrictAccessMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        'Você não possui permissão para acessar este contéudo'
      );
    }
    next();
  };
};

export default restrictAccessMiddleware;
