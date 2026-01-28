export const validateWith = (predicate, errorFactory) => (value) => {
  if (predicate(value)) return value;
  throw errorFactory();
};

export default validateWith;
