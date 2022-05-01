import jwt from 'jsonwebtoken';
import UserInfo from '../types/user-info';
import { Response } from 'express';

const createToken = (payload: UserInfo): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME || '30d',
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

const sendTokenAsCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

export { createToken, verifyToken, sendTokenAsCookie };
