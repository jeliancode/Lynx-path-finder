import validateWith from './validator.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';
import { ResultMonad, Ok } from '../shared/funtional/monad.js';

const toKey = ({ x, y }) => `${x},${y}`;

const obstacleSetFrom = (obstacles) =>
  new Set(obstacles.map(toKey));

const validatePointNotBlocked = (obstacleSet) =>
  validateWith(
    (point) => !obstacleSet.has(toKey(point)),
    (point) =>
      unprocessableEntityError(
        `Point (${point.x}, ${point.y}) is blocked by an obstacle`
      )
  );

export const validatePointsNotBlocked =
  (expandedObstacles) =>
  (points) => {

    const obstacleSet = obstacleSetFrom(expandedObstacles);
    const pointsArray = Array.isArray(points) ? points : [points];

    return pointsArray.reduce(
      (acc, point) =>
        ResultMonad.chain(() =>
          validatePointNotBlocked(obstacleSet)(point)
        )(acc),
      Ok(pointsArray)
    );
  };