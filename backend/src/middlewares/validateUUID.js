import { ResultMonad, Ok, Error } from '../domain/shared/funtional/monad.js';
import { badRequestError } from '../domain/shared/error/httpError.js';
import { isValidUUID } from '../domain/validator/uuidValidator.js';

export const validateUUID = (field = 'id') => (req, res, next) => {
  const value = req.params[field];

  const checkUUID = (id) => 
    (id && isValidUUID(id))
      ? Ok(id)
      : Error(badRequestError(`Invalid ID format: ${field}`));

  const validationResult = checkUUID(value);

  return ResultMonad.fold(
    (error) => next(error),
    () => next()
  )(validationResult);
};