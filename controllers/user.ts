import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import User from '../models/User';
import { createToken, sendTokenAsCookie } from '../utils/jwt';

const getAllUsers = asyncWrapper(async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.status(StatusCodes.OK).json({ users, numberOfUsers: users.length });
});

const getSingleUser = asyncWrapper(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new NotFoundError(`Nenhum usuário com o ID ${userId} foi encontrado`);
  }
  res.status(StatusCodes.OK).json({ user: user.getUserInfo() });
});

const getCurrentUser = asyncWrapper(async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
});

const updateUsername = asyncWrapper(async (req: Request, res: Response) => {
  const { user } = req;
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError('Por favor, informe o novo nome de usuário');
  }
  const userData = await User.findByIdAndUpdate(
    user.userId,
    { name },
    { new: true, runValidators: true }
  ).select('-password');
  const newToken = createToken(userData.getUserInfo());
  sendTokenAsCookie(res, newToken);
  res
    .status(StatusCodes.OK)
    .json({
      user: userData.getUserInfo(),
      msg: 'Nome atualizado com sucesso!',
    });
});

const updateEmail = asyncWrapper(async (req: Request, res: Response) => {
  const { user } = req;
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Por favor, informe o novo e-mail');
  }
  const userData = await User.findByIdAndUpdate(
    user.userId,
    { email },
    { new: true, runValidators: true }
  ).select('-password');
  const newToken = createToken(userData.getUserInfo());
  sendTokenAsCookie(res, newToken);
  res.status(StatusCodes.OK).json({
    user: userData.getUserInfo(),
    msg: 'E-mail atualizado com sucesso!',
  });
});

const updatePassword = asyncWrapper(async (req: Request, res: Response) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Por favor, informe sua senha atual e a nova');
  }
  const userData = await User.findById(user.userId);
  const passwordMatches = await userData.comparePassword(currentPassword);

  if (!passwordMatches) {
    throw new BadRequestError('Senha atual está incorreta');
  }
  userData.password = newPassword;
  userData.save();
  res.status(StatusCodes.OK).json({ msg: 'Senha atualizada com sucesso!' });
});

export {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUsername,
  updateEmail,
  updatePassword,
};
