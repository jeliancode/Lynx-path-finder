import { getMapById } from "../infrastructure/repositories/mapRepository.js";
import validateWith from "../utils/validator/validator.js";

const existsMapId = (mapId) => mapId != null;
const isMapFound = (map) => map != null;

export const validateMapExists = () => async (req, res, next) => {
  try {
    const { mapId } = req.params;

    validateWith(existsMapId, () => new Error("Map ID is required"))(mapId);

    const map = await getMapById(mapId);

    validateWith(isMapFound, () => new Error("Map not found"))(map);

    req.map = map;
    next();
  } catch (err) {
    next(err);
  }
};
