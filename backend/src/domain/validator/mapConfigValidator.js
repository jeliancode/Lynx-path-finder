import validateWith  from './validator.js';
import pipe from '../shared/funtional/pipe.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';

const hasObstacles = (map) =>
  Array.isArray(map.obstacles) && map.obstacles.length > 0;

const hasWaypoints = (map) =>
  Array.isArray(map.waypoints) && map.waypoints.length > 0;


export const validateMapConfiguration = pipe(
  validateWith(hasObstacles, () => unprocessableEntityError('Map must contain obstacles')),
  validateWith(hasWaypoints, () => unprocessableEntityError('Map must contain waypoints')),
);
