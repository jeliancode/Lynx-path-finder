import validateWith from './validator.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';

const toKey = ({ x, y }) => `${x},${y}`;

const firstUnreachableWaypoint =
  (visitedSet) =>
  (waypoints) =>
    waypoints.find((wp) => !visitedSet.has(toKey(wp)));

export const validateWaypointsReachableFromStart =
  () =>
    validateWith(
      (route) => {
        const { visitedNodes, orderedStops } = route;
        if (!Array.isArray(orderedStops)) return true;
        return !firstUnreachableWaypoint(visitedNodes)(orderedStops);
      },
      () =>
        unprocessableEntityError(
          'Some waypoints are not reachable from the start point'
        )
    );