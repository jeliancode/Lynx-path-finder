import validateWith from "./validator.js";
import pipe from "../shared/funtional/pipe.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";
import { hasValidDimensions } from "./entirtyRules.js";

const validateObstacleData = pipe(
    validateWith(hasValidDimensions, () => unprocessableEntityError('Obstacle must have valid dimensions'))
);

export default validateObstacleData;
