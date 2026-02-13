import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import { buildRouteThroughWaypoints } from '../../utils/pathFinder/routeBuilder.js';
import { validateWaypointsReachable } from '../../utils/validator/reachableWaypointValidator.js';
import { validateMapConfiguration } from '../../utils/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../utils/validator/routePointsValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../utils/funtional/monad.js';
import pipe from '../../utils/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const createNewRoute = (routeData, map) =>
  pipe(
    () => validateMapConfiguration(map),
    () => {
      const startPoint = { x: routeData.startX, y: routeData.startY };
      const endPoint = { x: routeData.endX, y: routeData.endY };
      return validateStartEndPoints(map.obstacles)(startPoint)(endPoint);
    },
    () => {
      const waypoints = map.waypoints.map(wp => ({ x: wp.x, y: wp.y }));
      const { path, distance } = buildRouteThroughWaypoints(
        { width: map.width, height: map.height, obstacles: map.obstacles },
        { x: routeData.startX, y: routeData.startY },
        waypoints,
        { x: routeData.endX, y: routeData.endY }
      );
      return Ok({ ...routeData, distance, path });
    },
    (completeData) => fromPromise(() => routeRepository.createRoute(completeData))
  )();

export const validateRouteWaypoints = (routeId, map) =>
  fromPromise(() => routeRepository.getRouteById(routeId))
    .then(result => ResultMonad.chain(ensureFound('Route not found'))(result))
    .then(result => ResultMonad.chain(route => 
       validateWaypointsReachable(route.path)(map.waypoints)
    )(result));

export const fetchAllRoutes = () => 
  fromPromise(() => routeRepository.getAllRoutes());

export const fetchRouteById = (id) =>
  fromPromise(() => routeRepository.getRouteById(id))
    .then(result => ResultMonad.chain(ensureFound('Route not found'))(result));

export const modifyRouteById = (id, updateData, map) =>
  fromPromise(() => routeRepository.getRouteById(id))
    .then(result => ResultMonad.chain(ensureFound('Route to update not found'))(result))
    .then(result => ResultMonad.chain(existingRoute => {
      return pipe(
        () => validateMapConfiguration(map),
        () => {
          const start = { x: updateData.startX ?? existingRoute.startX, y: updateData.startY ?? existingRoute.startY };
          const end = { x: updateData.endX ?? existingRoute.endX, y: updateData.endY ?? existingRoute.endY };
          return validateStartEndPoints(map.obstacles)(start)(end);
        },
        () => {
          const start = { x: updateData.startX ?? existingRoute.startX, y: updateData.startY ?? existingRoute.startY };
          const end = { x: updateData.endX ?? existingRoute.endX, y: updateData.endY ?? existingRoute.endY };
          const { path, distance } = buildRouteThroughWaypoints(
            { width: map.width, height: map.height, obstacles: map.obstacles },
            start, 
            map.waypoints.map(wp => ({ x: wp.x, y: wp.y })), 
            end
          );
          return Ok({ ...updateData, startX: start.x, startY: start.y, endX: end.x, endY: end.y, path, distance });
        }
      )();
    })(result))
    .then(result => ResultMonad.chain(completeUpdate => 
      fromPromise(() => routeRepository.updateRouteById(id, completeUpdate))
    )(result));

export const removeRouteById = (id) =>
  fromPromise(() => routeRepository.deleteRouteById(id));