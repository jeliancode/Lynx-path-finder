import validateWith from './validator.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';
import { ResultMonad, Ok } from '../shared/funtional/monad.js';

const toKey = ({ x, y }) => `${x},${y}`;

const obstacleSetFrom = (obstacles) =>
  new Set(obstacles.map(toKey));

const isBlocked = (obstacleSet) => (point) =>
  obstacleSet.has(toKey(point));

const validateNotBlocked = (obstacleSet, label) =>
  validateWith(
    (point) => !isBlocked(obstacleSet)(point),
    () => unprocessableEntityError(`${label} point is blocked by an obstacle`)
  );


export const validateStartEndPoints =
  obstacles =>
  start =>
  end => {
    const obstacleSet = obstacleSetFrom(obstacles);

    return ResultMonad.chain(() =>
      ResultMonad.map(() => ({ start, end }))(
        validateNotBlocked(obstacleSet, 'Destiny')(end)
      )
    )(
      validateNotBlocked(obstacleSet, 'Start')(start)
    );
  };
