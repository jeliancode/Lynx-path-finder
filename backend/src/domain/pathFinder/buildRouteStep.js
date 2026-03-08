import { Ok, Error } from "../shared/funtional/monad.js";
import buildRouteThroughWaypoints from "./routeBuilder.js";
import { aStarPathfinder } from "./aStarAlgorithm.js";
import { manhattanDistance } from "./heuristics.js";
import getValidNeighbors from "./pathfindingNeighbors.js";
import { memoizedPathfinder } from "./memoizedPathfinder.js";
import { notFoundError } from "../shared/error/httpError.js";

const toCoords = (wp) => ({ x: wp.x, y: wp.y });

const createPathfinder = (map, obstacles) => {

  const neighbors = getValidNeighbors({
    width: map.width,
    height: map.height,
    obstacles
  });

  const baseStrategy =
    aStarPathfinder(manhattanDistance)(neighbors);

  const memoizedStrategy =
    memoizedPathfinder(baseStrategy);

  return buildRouteThroughWaypoints(memoizedStrategy);
};

export const buildRoute =
  (map) =>
  ({ routeData, expandedObs, start, end, orderedStops }) => {

    const pathfinder = createPathfinder(map, expandedObs);

    const { path, distance, visitedNodes } = pathfinder(
      start,
      orderedStops.map(toCoords),
      end
    );

    if (!path || path.length === 0) {
      return Error(notFoundError("No valid route found"));
    }

    return Ok({
      ...routeData,
      path,
      distance,
      visitedNodes
    });
  };
  