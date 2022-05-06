import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import Property from '../models/Property';
import PropertyQuery from '../types/property-query';
import FilterEquivalents from '../types/query-filters';
import uploadImages from '../utils/upload_images';

const getAllProperties = asyncWrapper(async (req: Request, res: Response) => {
  const {
    title,
    state,
    city,
    announceType,
    petAllowed,
    hasGarage,
    numericFilters,
    sort,
    select,
    page,
    limit,
  } = req.query;
  const queryObject: PropertyQuery = {};

  if (title) {
    queryObject.title = { $regex: title as string, $options: 'i' };
  }
  if (petAllowed) {
    queryObject.petAllowed = petAllowed === 'true' ? true : false;
  }
  if (hasGarage) {
    queryObject.hasGarage = hasGarage === 'true' ? true : false;
  }
  if (announceType) {
    queryObject.announceType = announceType === 'sale' ? 'sale' : 'rent';
  }
  if (numericFilters) {
    const filtersEquivalents: FilterEquivalents = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const filtersRegex = /\b(>|>=|=|<|<=)\b/g;
    const resultFilters: string = (<string>numericFilters).replace(
      filtersRegex,
      (match: string) => `-${filtersEquivalents[match]}-`
    );
    const allowedFields = ['price', 'numberBedrooms', 'numberBathrooms'];
    resultFilters.split(',').forEach((filter) => {
      const [field, regex, value] = filter.split('-');

      // If the field doesn't have any regex yet
      if (allowedFields.includes(field) && !queryObject[field]) {
        queryObject[field] = { [regex]: Number(value) };
      }
      // If the field already has a regex, the new one is added
      else if (allowedFields.includes(field)) {
        queryObject[field][regex] = Number(value);
      }
    });
  }
  const propertiesResult = Property.find(queryObject).populate('location');

  // Sorting the query by the requested fields
  if (sort) {
    const sortingList: string = (<string>sort).split(',').join(' ');
    propertiesResult.sort(sortingList);
  }
  // Selecting only the requested fields
  if (select) {
    const selectList: string = (<string>select).split(',').join(' ');
    propertiesResult.select(selectList);
  }
  // Pagination
  if (page) {
    const pageLimit = Number(limit) || 6;
    const requestedPage = Number(page) - 1;
    const skippedItems = pageLimit * requestedPage;
    propertiesResult.skip(skippedItems).limit(pageLimit);
  }
  let properties = await propertiesResult;

  // Filtering the properties by the provided state
  if (state) {
    const stateRegex = new RegExp(state as string, 'i');
    properties = properties.filter((property) =>
      stateRegex.test(property.location.state)
    );
  }
  // Filtering the properties by the provided city
  if (city) {
    const cityRegex = new RegExp(city as string, 'i');
    properties = properties.filter((property) => cityRegex.test(property.location.city));
  }
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

const getPropertiesOfOneUser = asyncWrapper(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const properties = await Property.find({ announcer: userId });
    res
      .status(StatusCodes.OK)
      .json({ properties, numberOfProperties: properties.length });
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
  getPropertiesOfOneUser,
  createProperty,
  updateProperty,
  deleteProperty,
};
