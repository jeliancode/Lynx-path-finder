import validateWith from "./validator.js";
import pipe from "../shared/funtional/pipe.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";
import { hasValidName } from "./entirtyRules.js";

const validateWaypointData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('Waypoint must have a valid name')),
);

export default validateWaypointData;
