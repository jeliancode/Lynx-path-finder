import { getMapById } from '../infrastructure/repositories/mapRepository.js';
import validateWith from '../utils/validator/validator.js';
import { unprocessableEntityError, notFoundError } from '../utils/error/httpError.js'

const existsMapId = (mapId) => mapId != null;
const isMapFound = (map) => map != null;

export const validateMapExists = () => async (req, res, next) => {
  try {
    const { mapId } = req.params;

    validateWith(existsMapId, () => unprocessableEntityError('Map ID is required'))(mapId);

    const map = await getMapById(mapId);

    validateWith(isMapFound, () => notFoundError('Map not found'))(map);

    req.map = map;
    next();
  } catch (error) {
    next(error);
  }
};
