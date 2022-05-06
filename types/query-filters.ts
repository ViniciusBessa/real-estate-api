type FilterEquivalents = {
  [key: string]: string;
  '>': '$gt';
  '>=': '$gte';
  '=': '$eq';
  '<': '$lt';
  '<=': '$lte';
};

export default FilterEquivalents;
