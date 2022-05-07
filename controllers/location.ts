import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
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

  // Sorting the query by the requested fields
  if (sort) {
    const sortingList: string = (<string>sort).split(',').join(' ');
    locationsResult.sort(sortingList);
  }
  // Selecting only the requested fields
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

const getAllStates = asyncWrapper(async (req: Request, res: Response) => {
  const locations = await Location.find().select('state').sort('state');
  let states: string[] = locations.map((location) => location.state);

  // Filtering possible duplicates
  const seenStates: any = {};
  states = states.filter((state) =>
    seenStates[state] ? false : (seenStates[state] = true)
  );
  res.status(StatusCodes.OK).json({ states, numberOfStates: states.length });
});

const getAllCitiesFromState = asyncWrapper(
  async (req: Request, res: Response) => {
    const { state } = req.params;

    if (!state) {
      throw new BadRequestError('Por favor, informe um estado');
    }
    const stateRegex = { $regex: state, $options: 'i' };
    const locations = await Location.find({ state: stateRegex })
      .select('city')
      .sort('city');
    let cities: string[] = locations.map((location) => location.city);

    // Filtering possible duplicates
    const seenCities: any = {};
    cities = cities.filter((city) =>
      seenCities[city] ? false : (seenCities[city] = true)
    );
    res.status(StatusCodes.OK).json({ cities, numberOfCities: cities.length });
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
  getAllStates,
  getAllCitiesFromState,
  createLocation,
  updateLocation,
  deleteLocation,
};
