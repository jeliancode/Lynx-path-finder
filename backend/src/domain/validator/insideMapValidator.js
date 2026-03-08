import validateWith from './validator.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';

const asArray = (value) => Array.isArray(value) ? value : [value];

const isPointInsideMap =
  (map) =>
  ({ x, y }) =>
    x >= 0 &&
    x < map.width &&
    y >= 0 &&
    y < map.height;

const entitiesInsideMap =
  (map, getPoints, errorMessage) =>
    validateWith(
      (entities) =>
        asArray(entities).every((entity) =>
          asArray(getPoints(entity)).every(isPointInsideMap(map))
        ),
      () => unprocessableEntityError(errorMessage)
    );

export const validateObstacleInsideMap = (map) =>
  entitiesInsideMap(
    map,
    ({ x, y }) => ({ x, y }),
    'Obstacle outside the map boundary'
  );

export const validateWaypointsInsideMap = (map) =>
  entitiesInsideMap(
    map,
    ({ x, y }) => ({ x, y }),
    'Waypoint outside the map boundary'
  );

export const validateRoutePointsInsideMap = (map) =>
  entitiesInsideMap(
    map,
    ({ startX, startY, endX, endY }) => [
      { x: startX, y: startY },
      { x: endX, y: endY }
    ],
    'Route start or end points outside the map boundary'
  );
