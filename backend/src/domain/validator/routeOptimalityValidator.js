import { Ok, Error } from "../shared/funtional/monad.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const calculatePathDistance = (path) =>
  path.slice(1).reduce((acc, node, i) => {
    const prev = path[i];
    const stepDistance =
      Math.abs(node.x - prev.x) + Math.abs(node.y - prev.y);

    return acc + stepDistance;
  }, 0);

const hasLoops = (path) => {
  const visited = new Set();

  for (const node of path) {
    const key = `${node.x},${node.y}`;
    if (visited.has(key)) return true;
    visited.add(key);
  }

  return false;
};

export const validateOptimalRoute =
  () =>
  (route) => {

    const calculatedDistance = calculatePathDistance(route.path);

    if (hasLoops(route.path)) {
      return Error(
        unprocessableEntityError(
          "Route contains unnecessary loops"
        )
      );
    }

    if (calculatedDistance !== route.distance) {
      return Error(
        unprocessableEntityError(
          "Route distance mismatch — route may contain unnecessary detours"
        )
      );
    }

    return Ok(route);
  };