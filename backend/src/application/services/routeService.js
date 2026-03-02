import buildRouteThroughWaypoints from '../../domain/pathFinder/routeBuilder.js';
import { aStarPathfinder } from '../../domain/pathFinder/aStarAlgorithm.js';
import { manhattanDistance } from '../../domain/pathFinder/heuristics.js';
import getValidNeighbors from '../../domain/pathFinder/pathfindingNeighbors.js';
import { validateWaypointsReachable } from '../../domain/validator/reachableWaypointValidator.js';
import { validateMapConfiguration } from '../../domain/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../domain/validator/routePointsValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import { validatePossibleRoute } from '../../domain/validator/possibleRouteValidator.js';
import { analyzeExecution } from '../../infrastructure/performance/performanceAnalyzer.js';
import { validatePerformanceMetrics } from '../../domain/validator/performanceValidator.js';
import { hasValidPath } from '../../domain/pathFinder/bfsAlgorithm.js';
import pipe from '../../domain/shared/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

const createPathfinder = (map) => {
  const neighbors = getValidNeighbors({ width: map.width, height: map.height, obstacles: map.obstacles });
  const strategy = aStarPathfinder(manhattanDistance)(neighbors);
  return buildRouteThroughWaypoints(strategy);
};

const getPoint = (data, prefix = 'start', fallback = {}) => ({
  x: data[`${prefix}X`] ?? fallback[`${prefix}X`],
  y: data[`${prefix}Y`] ?? fallback[`${prefix}Y`]
});

export const routeService = ({ routeRepository }, { waypointRepository }) => ({

  createNewRoute: (routeData, map) => {
    const routeBuilder = createPathfinder(map);

    return pipe(
      () => validateMapConfiguration(map),

      () => {
        const start = getPoint(routeData, 'start');
        const end = getPoint(routeData, 'end');
        return validateStartEndPoints(map.obstacles)(start)(end);
      },

      () =>
        fromPromise(() =>
          waypointRepository.findByIds(routeData.stopIds || [])
        ),

      (stops) => {
        if (!stops || stops.length !== (routeData.stopIds || []).length) {
          return ResultMonad.Error(new Error('Some stops were not found'));
        }
        return Ok(stops);
      },

      (stops) => {
        const invalidStop = stops.find(stop => stop.mapId !== map.id);
        if (invalidStop) {
          return ResultMonad.Error(
            new Error('One or more stops do not belong to this map')
          );
        }
        return Ok(stops);
      },

      (stops) => {
        const stopMap = new Map(stops.map(s => [s.id, s]));

        const orderedStops = routeData.stopIds.map(id => stopMap.get(id));

        const waypoints = orderedStops.map(stop => ({
          x: stop.x,
          y: stop.y
        }));

        const start = getPoint(routeData, 'start');
        const end = getPoint(routeData, 'end');

        const { path, distance } = routeBuilder(start, waypoints, end);

        return Ok({
          ...routeData,
          distance,
          path
        });
      },

      (completeData) =>
        fromPromise(() =>
          routeRepository.createRoute(completeData)
        )
    )();
  },

  getPossibleRoute: (routeData, map) =>
    pipe(
      () => validateMapConfiguration(map),
      () => {
        const start = getPoint(routeData, 'start');
        const end = getPoint(routeData, 'end');
        return validateStartEndPoints(map.obstacles)(start)(end);
      },
      () => {
        const start = getPoint(routeData, 'start');
        const end = getPoint(routeData, 'end');
        return validatePossibleRoute(map)(start)(end);
      }
    )(),

  modifyRouteById: (id, updateData, map) => {
    const routeBuilder = createPathfinder(map);

    return fromPromise(() => routeRepository.getRouteById(id))
      .then(result => ResultMonad.chain(ensureFound('Route to update not found'))(result))
      .then(result => ResultMonad.chain(existingRoute => 
        pipe(
          () => validateMapConfiguration(map),
          () => {
            const start = getPoint(updateData, 'start', existingRoute);
            const end = getPoint(updateData, 'end', existingRoute);
            return validateStartEndPoints(map.obstacles)(start)(end);
          },
          () => {
            const start = getPoint(updateData, 'start', existingRoute);
            const end = getPoint(updateData, 'end', existingRoute);
            const waypoints = map.waypoints.map(wp => ({ x: wp.x, y: wp.y }));

            const { path, distance } = routeBuilder(start, waypoints, end);

            return Ok({ 
              ...updateData, 
              ...start.x && { startX: start.x, startY: start.y },
              ...end.x && { endX: end.x, endY: end.y },
              path, distance 
            });
          }
        )()
      )(result))
      .then(result => ResultMonad.chain(completeUpdate => 
        fromPromise(() => routeRepository.updateRouteById(id, completeUpdate))
      )(result));
  },

  validateRouteWaypoints: (routeId, map) =>
    fromPromise(() => routeRepository.getRouteById(routeId))
      .then(result => ResultMonad.chain(ensureFound('Route not found'))(result))
      .then(result => ResultMonad.chain(route => validateWaypointsReachable(route.path)(map.waypoints))(result)),

  fetchAllRoutes: () => fromPromise(() => routeRepository.getAllRoutes()),

  fetchRouteById: (id) =>
    fromPromise(() => routeRepository.getRouteById(id))
      .then(result => ResultMonad.chain(ensureFound('Route not found'))(result)),

  removeRouteById: (id) =>
    fromPromise(() => routeRepository.deleteRouteById(id))
      .then(result => ResultMonad.chain(ensureFound('Route to delete not found'))(result)),

  analyzeRoutePerformance: async (routeData, map) => {
    const start = getPoint(routeData, 'start');
    const end = getPoint(routeData, 'end');

    const analysis = await analyzeExecution(() =>
      hasValidPath({
        width: map.width,
        height: map.height,
        startPoint: start,
        endPoint: end,
        obstacles: map.obstacles
      })
    );

    return validatePerformanceMetrics(analysis.metrics);
  },
});