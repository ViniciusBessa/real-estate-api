import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors';
import asyncWrapper from '../middlewares/async-wrapper';
import Location from '../models/Location';
import LocationQuery from '../types/location-query';

const getAllLocations = asyncWrapper(async (req: Request, res: Response) => {
  const { state, city, select, sort } = req.query;
  const queryObject: LocationQuery = {};

  if (state) {
    queryObject.state = { $regex: state as string, $options: 'i' };
  }
  if (city) {
    queryObject.city = { $regex: city as string, $options: 'i' };
  }
  let locationsResult = Location.find(queryObject);

  if (sort) {
    const sortingList: string = (<string>sort).split(',').join(' ');
    locationsResult.sort(sortingList);
  }
  if (select) {
    const selectList: string = (<string>select).split(',').join(' ');
    locationsResult.select(selectList);
  }
  const locations = await locationsResult;
  res
    .status(StatusCodes.OK)
    .json({ locations, numberOfLocations: locations.length });
});

const getSpecificLocation = asyncWrapper(
  async (req: Request, res: Response) => {
    const { locationId } = req.params;
    const location = await Location.findById(locationId);

    if (!location) {
      throw new NotFoundError(
        `Nenhuma localização com o ID ${locationId} foi encontrada`
      );
    }
    res.status(StatusCodes.OK).json({ location });
  }
);

const createLocation = asyncWrapper(async (req: Request, res: Response) => {
  const location = await Location.create(req.body);
  res.status(StatusCodes.CREATED).json({ location });
});

const updateLocation = asyncWrapper(async (req: Request, res: Response) => {
  const { locationId } = req.params;
  const location = await Location.findByIdAndUpdate(locationId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!location) {
    throw new NotFoundError(
      `Nenhuma localização com o ID ${locationId} foi encontrada`
    );
  }
  res.status(StatusCodes.OK).json({ location });
});

const deleteLocation = asyncWrapper(async (req: Request, res: Response) => {
  const { locationId } = req.params;
  const location = await Location.findByIdAndDelete(locationId);

  if (!location) {
    throw new NotFoundError(
      `Nenhuma localização com o ID ${locationId} foi encontrada`
    );
  }
  res.status(StatusCodes.OK).json({ location });
});

export {
  getAllLocations,
  getSpecificLocation,
  createLocation,
  updateLocation,
  deleteLocation,
};
