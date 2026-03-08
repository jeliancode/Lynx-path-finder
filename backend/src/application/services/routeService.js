import buildRouteThroughWaypoints from '../../domain/pathFinder/routeBuilder.js';
import { validateWaypointsReachable } from '../../domain/validator/reachableWaypointValidator.js';
import { validateRouteDistance } from '../../domain/validator/routeLengthValidator.js';
import { validateStartDifferentFromEnd } from '../../domain/validator/validateStartDifferentFromEnd.js';
import { validateWaypointsReachableFromStart } from '../../domain/validator/reachableFromStartValidator.js';
import { validateOptimalRoute } from '../../domain/validator/routeOptimalityValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { validateRouteExploration } from '../../domain/validator/pathfindingExplorationValidator.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import asyncPipe from '../../domain/shared/funtional/asyncPipe.js';
import { buildRoute } from '../../domain/pathFinder/buildRouteStep.js';
import { persistRoute } from '../../domain/pathFinder/persistRouteStep.js';
import {
  validateRouteRequest,
  fetchExpandedObstacles,
  validatePointsFree,
  validateMapDependencies,
  validateRouteObstaclesStep,
  validatePathExistsStep,
  fetchStops
} from '../../domain/pathFinder/routeValidatorPipeline.js';

const ensureFound = (errorMsg) => (data) =>
  data ? Ok(data) : Error(notFoundError(errorMsg));

const toCoords = (wp) => ({ x: wp.x, y: wp.y });

const extractStartEnd = (data) => ({
  start: { x: data.startX, y: data.startY },
  end: { x: data.endX, y: data.endY }
});

const createPathfinder = (map, obstacles) => {
  const neighbors = getValidNeighbors({ 
    width: map.width, 
    height: map.height, 
    obstacles 
  });
  const strategy = aStarPathfinder(manhattanDistance)(neighbors);
  return buildRouteThroughWaypoints(strategy);
};

export const routeService = ({ routeRepository }, { waypointRepository }, { obstacleRepository }) => ({
  createNewRoute: (routeData, map) =>
    asyncPipe(
      () => validateRouteRequest(map)(routeData),
      validateStartDifferentFromEnd,
      validateMapDependencies(map),
      fetchExpandedObstacles(obstacleRepository, map),
      validatePointsFree(),
      fetchStops(waypointRepository, map),
      validatePathExistsStep(map),
      buildRoute(map),
      validateRouteExploration,
      validateWaypointsReachableFromStart(map),
      validateOptimalRoute(),
      (route) => validateRouteDistance(route.startX, route.startY, route.endX, route.endY)(route),
      persistRoute(routeRepository)
    )(),

  modifyRouteById: async (id, updateData, map) => {
      return asyncPipe(
        () => fromPromise(() => routeRepository.getRouteById(id)),
        ensureFound('Route to update not found'),
        
        async (existingRoute) => {
          const combined = { ...existingRoute, ...updateData };
          const { start, end } = extractStartEnd(combined);
          const obsResult = await fromPromise(() => obstacleRepository.findByMapId(map.id));
          return ResultMonad.map(obstacles => {
            const expandedObs = expandObstacles(obstacles);
            const routeBuilder = createPathfinder(map, expandedObs);
            const { path, distance } = routeBuilder(start, map.waypoints.map(toCoords), end);
            return { ...combined, path, distance };
          })(obsResult);
        },
        (finalData) => fromPromise(() => routeRepository.updateRouteById(id, finalData))
      )();
    },

  fetchRouteById: (id) =>
    asyncPipe(
      () => fromPromise(() => routeRepository.getRouteById(id)),
      ensureFound('Route not found')
    )(),

  removeRouteById: (id) =>
    asyncPipe(
      () => fromPromise(() => routeRepository.deleteRouteById(id)),
      ensureFound('Route to delete not found')
    )(),

  validateRoute: (routeId, map) =>
    asyncPipe(
      () => fromPromise(() => routeRepository.getRouteById(routeId)),
      ensureFound('Route not found'),
      validateRouteObstaclesStep(obstacleRepository, map),
      (route) => validateWaypointsReachable(route)(map.waypoints)
    )(),

  fetchAllRoutes: () => fromPromise(() => routeRepository.getAllRoutes()),
});