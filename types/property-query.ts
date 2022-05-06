type PropertyQuery = {
  [key: string]: any,
  title?: { $regex: string; $options: string };
  petAllowed?: boolean;
  hasGarage?: boolean;
  announceType?: string,
};

export default PropertyQuery;
