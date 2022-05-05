import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';

const restrictAcessMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
  allowedRoles: string[]
) => {
  if (!allowedRoles.includes(req.user.role)) {
    throw new ForbiddenError(
      'Você não possui permiação para acessar esse conteúdo'
    );
  }
  next();
};

export default restrictAcessMiddleware;
