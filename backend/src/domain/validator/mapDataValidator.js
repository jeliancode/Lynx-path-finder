import validateWith from "./validator.js";
import pipe from "../shared/funtional/pipe.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";
import { hasValidName, hasValidDimensions, hasValidUserId } from "./entirtyRules.js";

const validateMapData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('Map must have a valid name')),
    validateWith(hasValidDimensions, () => unprocessableEntityError('Map must have valid dimensions')),
    validateWith(hasValidUserId, () => unprocessableEntityError('Map must have a valid user id assigned'))
);

export default validateMapData;
