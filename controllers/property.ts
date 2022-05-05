import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import Property from '../models/Property';

const getAllProperties = asyncWrapper(
  async (req: Request, res: Response) => {}
);

const getSpecificProperty = asyncWrapper(
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    if (!propertyId) {
      throw new BadRequestError('Informe o ID do imóvel');
    }
    const property = await Property.findById(propertyId).populate('announcer');

    if (!property) {
      throw new NotFoundError(
        `Nenhum imóvel com o ID ${propertyId} foi encontrado`
      );
    }
    res.status(StatusCodes.OK).json({ property });
  }
);

const createProperty = asyncWrapper(async (req: Request, res: Response) => {
});

const updateProperty = asyncWrapper(async (req: Request, res: Response) => {});

const deleteProperty = asyncWrapper(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const property = await Property.findByIdAndDelete(propertyId);

  if (!property) {
    throw new NotFoundError(
      `Nenhum imóvel com o ID ${propertyId} foi encontrado`
    );
  }
  res.status(StatusCodes.OK).json({ property });
});

export {
  getAllProperties,
  getSpecificProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
