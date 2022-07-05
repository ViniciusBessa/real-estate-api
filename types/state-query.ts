type StateQuery = {
  state?: { $regex: string; $options: string };
};

export default StateQuery;
