import { getMapById } from '../infrastructure/repositories/mapRepository.js';
import validateWith from '../domain/validator/validator.js';
import { unprocessableEntityError, notFoundError } from '../domain/shared/error/httpError.js'
import { ResultMonad, fromPromise, Ok } from '../domain/shared/funtional/monad.js';
import pipe from '../domain/shared/funtional/pipe.js';

const existsMapId = (mapId) => mapId != null;
const isMapFound = (map) => map != null;

export const validateMapExists = () => async (req, res, next) => {
  const { mapId } = req.params;

  const result = await pipe(
    validateWith(existsMapId, () => unprocessableEntityError('Map ID is required')),
    async (id) => {
      const mapResult = await fromPromise(() => getMapById(id));
      return ResultMonad.chain(
        validateWith(isMapFound, () => notFoundError('Map not found'))
      )(mapResult);
    }
  )(mapId);

  ResultMonad.fold(
    (error) => next(error),
    (map) => {
      req.map = map;
      next();
    }
  )(result);
};