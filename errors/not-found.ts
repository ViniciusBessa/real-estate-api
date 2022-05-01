import { StatusCodes } from 'http-status-codes';
import APIError from './api-error';

export default class NotFoundError extends APIError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
