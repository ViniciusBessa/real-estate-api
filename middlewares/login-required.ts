import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';
import asyncWrapper from './async-wrapper';

const loginRequiredMiddleware = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError(
        'É necessário estar logado para acessar esse URL'
      );
    }
    next();
  }
);

export default loginRequiredMiddleware;
