import { Ok, Error } from "../shared/funtional/monad.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const toKey = ({ x, y }) => `${x},${y}`;

const buildObstacleSet = (obstacles) =>
  new Set(obstacles.map(toKey));

export const validateRouteNotIntersectingObstacles =
  (expandedObstacles) =>
  (path) => {

    const obstacleSet = buildObstacleSet(expandedObstacles);

    const collision = path.find((node) =>
      obstacleSet.has(toKey(node))
    );

    if (collision) {
      return Error(
        unprocessableEntityError(
          `Route intersects an obstacle at (${collision.x}, ${collision.y})`
        )
      );
    }

    return Ok(path);
  };