import validateWith from './validator.js';
import { unprocessableEntity } from '../error/httpError.js';

const toKey = ({ x, y }) => `${x},${y}`;

const obstacleSetFrom = (obstacles) =>
  new Set(obstacles.map(toKey));

const isBlocked = (obstacleSet) => (point) =>
  obstacleSet.has(toKey(point));

const validateNotBlocked = (obstacleSet, label) =>
  validateWith(
    (point) => !isBlocked(obstacleSet)(point),
    () => unprocessableEntity(`${label} point is blocked by an obstacle`)
  );


export const validateStartEndPoints =
  obstacles =>
  start =>
  end => {
    const obstacleSet = obstacleSetFrom(obstacles);

    validateNotBlocked(obstacleSet, 'Start')(start);
    validateNotBlocked(obstacleSet, 'Destiny')(end);

    return { start, end };
  };
