import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import Property from '../models/Property';
import PropertyQuery from '../types/property-query';
import uploadImages from '../utils/upload_images';

const getAllProperties = asyncWrapper(async (req: Request, res: Response) => {
  const { title, sort, select } = req.query;
  const queryObject: PropertyQuery = {};

  if (title) {
    queryObject.title = { $regex: title as string, $options: 'i' };
  }
  let propertiesResult = Property.find(queryObject);

  if (sort) {
    const sortingList: string = (<string>sort).split(',').join(' ');
    propertiesResult.sort(sortingList);
  }
  if (select) {
    const selectList: string = (<string>select).split(',').join(' ');
    propertiesResult.select(selectList);
  }
  const properties = await propertiesResult;
  res
    .status(StatusCodes.OK)
    .json({ properties, numberOfProperties: properties.length });
});

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
  const images = req.files ? await uploadImages(req.files) : req.body.images;
  const property = await Property.create({ ...req.body, images });
  res.status(StatusCodes.CREATED).json({ property });
});

const updateProperty = asyncWrapper(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const property = await Property.findByIdAndUpdate(propertyId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!property) {
    throw new NotFoundError(
      `Nenhum imóvel com o ID ${propertyId} foi encontrado`
    );
  }
  res.status(StatusCodes.OK).json({ property });
});

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
