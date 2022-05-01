import { StatusCodes } from 'http-status-codes';
import APIError from './api-error';

export default class UnauthorizedError extends APIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
