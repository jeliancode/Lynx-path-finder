import validateWith from "../validator/validator.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

export const validateRouteExploration =
  validateWith(
    (route) =>
      route &&
      route.visitedNodes &&
      route.visitedNodes.size > 0,
    () =>
      unprocessableEntityError(
        "Pathfinding algorithm did not explore any possible routes"
      )
  );