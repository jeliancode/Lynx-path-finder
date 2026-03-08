import validateWith from "./validator.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const arePointsDifferent = ({ startX, startY, endX, endY }) =>
  startX !== endX || startY !== endY;

export const validateStartDifferentFromEnd =
  validateWith(
    arePointsDifferent,
    ({ startX, startY }) =>
      unprocessableEntityError(
        `Start point (${startX}, ${startY}) and destination point are the same`
      )
  );