import validateWith from "./validator.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const manhattanFactor = 5;

const manhattanDistance = (x1, y1, x2, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const isDistanceReasonable =
  (startX, startY, endX, endY) =>
  ({ distance }) => {

    const minDistance =
      manhattanDistance(startX, startY, endX, endY);

    const maxAllowedDistance =
      minDistance * manhattanFactor;

    return distance <= maxAllowedDistance;
  };

export const validateRouteDistance =
  (startX, startY, endX, endY) =>
    validateWith(
      isDistanceReasonable(startX, startY, endX, endY),
      ({ distance }) => {

        const minDistance =
          manhattanDistance(startX, startY, endX, endY);

        const maxAllowedDistance =
          minDistance * manhattanFactor;

        return unprocessableEntityError(
          `Route distance ${distance} exceeds allowed limit. ` +
          `Minimum possible distance is ${minDistance}, maximum allowed is ${maxAllowedDistance}`
        );
      }
    );