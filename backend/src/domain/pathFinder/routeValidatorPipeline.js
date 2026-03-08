import { Ok, Error, ResultMonad, fromPromise } from "../shared/funtional/monad.js";
import { validateMapConfiguration } from "../validator/mapConfigValidator.js";
import { validateRoutePointsInsideMap } from "../validator/insideMapValidator.js";
import { validatePointsNotBlocked } from "../validator/routePointsValidator.js";
import { validateNoCyclicDependencies } from "../validator/mapDependencyValidator.js";
import { validateRouteNotIntersectingObstacles } from "../validator/routeObstacleValidator.js";
import { validatePathExists } from "../validator/pathExistenceValidator.js";
import { expandObstacles } from "./obstacleExpander.js";
import { notFoundError } from "../shared/error/httpError.js";

const extractStartEnd = (data) => ({
  start: { x: data.startX, y: data.startY },
  end: { x: data.endX, y: data.endY }
});

export const validateRouteRequest = (map) => (routeData) =>
  ResultMonad.chain(() =>
    validateRoutePointsInsideMap(map)(routeData)
  )(
    validateMapConfiguration(map)
  );

export const fetchExpandedObstacles =
  (obstacleRepository, map) =>
  async (routeData) => {

    const result = await fromPromise(() =>
      obstacleRepository.findByMapId(map.id)
    );

    return ResultMonad.map((obstacles) => ({
      routeData,
      expandedObs: expandObstacles(obstacles)
    }))(result);
  };

export const validatePointsFree =
  () =>
  ({ routeData, expandedObs }) => {

    const { start, end } = extractStartEnd(routeData);

    return ResultMonad.map(() => ({
      routeData,
      expandedObs,
      start,
      end
    }))(
      validatePointsNotBlocked(expandedObs)([start, end])
    );
  };

export const fetchStops =
  (waypointRepository, map) =>
  async ({ routeData, expandedObs, start, end }) => {

    const stopIds = routeData.stopIds || [];

    const result = await fromPromise(() =>
      waypointRepository.findByIds(stopIds)
    );

    return ResultMonad.chain((stops) => {

      if (stops.length !== stopIds.length) {
        return Error(notFoundError("Some waypoints were not found"));
      }

      const invalid = stops.find((s) => s.mapId !== map.id);

      if (invalid) {
        return Error(notFoundError("One or more waypoints do not belong to this map"));
      }

      const stopMap = new Map(stops.map((s) => [s.id, s]));

      const orderedStops = stopIds.map((id) => stopMap.get(id));

      return Ok({
        routeData,
        expandedObs,
        start,
        end,
        orderedStops
      });

    })(result);
  };

export const validateMapDependencies =
  (map) =>
  (data) =>
    ResultMonad.map(() => data)(
      validateNoCyclicDependencies(map.waypoints)
    );

export const validatePathExistsStep =
  (map) =>
  ({ expandedObs, start, end, ...data }) =>
    validatePathExists(map, expandedObs)({
      start,
      end,
      expandedObs,
      ...data
    });

export const validateRouteObstaclesStep =
  (obstacleRepository, map) =>
  async (route) => {

    const result = await fromPromise(() =>
      obstacleRepository.findByMapId(map.id)
    );

    return ResultMonad.chain((obstacles) => {

      const expanded = expandObstacles(obstacles);

      return validateRouteNotIntersectingObstacles(expanded)(route.path);

    })(result);
  };