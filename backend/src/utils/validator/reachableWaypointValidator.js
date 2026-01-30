import validateWith from './validator.js';
import { unprocessableEntityError } from '../error/httpError.js';

const toKey = ({ x, y }) => `${x},${y}`;

const pathToSet = (path) =>
  new Set(path.map(toKey));

const firstUnreachable = (pathSet) => (waypoints) =>
  waypoints.find(wp => !pathSet.has(toKey(wp)));

export const validateWaypointsReachable =
  (path) =>
    validateWith(
      (waypoints) => !firstUnreachable(pathToSet(path))(waypoints),
      () => unprocessableEntityError('Some waypoints are not reachable in the given path')
    );


