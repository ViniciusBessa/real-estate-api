type LocationQuery = {
  state?: { $regex: string; $options: string };
  city?: { $regex: string; $options: string };
};

export default LocationQuery;
