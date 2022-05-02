import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import User from '../models/User';
import { createToken, sendTokenAsCookie } from '../utils/jwt';

const registerUser = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const userToken = createToken(user.getUserInfo());
  sendTokenAsCookie(res, userToken);
  res.status(StatusCodes.CREATED).json({ user: user.getUserInfo() });
});

const loginUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Por favor, informe seu e-mail e senha');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      `Nenhum usuário com o e-mail ${email} foi encontrado`
    );
  }
  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new BadRequestError('Senha incorreta para este usuário');
  }
  const token = createToken(user.getUserInfo());
  sendTokenAsCookie(res, token);
  res.status(StatusCodes.OK).json({ user: user.getUserInfo() });
});

const logoutUser = asyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(StatusCodes.NO_CONTENT).json();
});

export { registerUser, loginUser, logoutUser };
