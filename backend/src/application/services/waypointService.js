import checkEach from '../../domain/validator/listValidator.js'
import { validateWaypointsInsideMap } from '../../domain/validator/insideMapValidator.js';
import { validatePointsNotBlocked } from '../../domain/validator/routePointsValidator.js';
import { expandObstacles } from '../../domain/pathFinder/obstacleExpander.js';
import validateWaypointData from '../../domain/validator/waypointDataValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import pipe from '../../domain/shared/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const waypointService = ({ waypointRepository }, { obstacleRepository }) => ({

  createNewWaypoint: (map, waypointData) =>
    fromPromise(() => obstacleRepository.findByMapId(map.id))
      .then(ResultMonad.chain((obstacles) => {
        const expanded = expandObstacles(obstacles);

        return pipe(
          validateWaypointData,
          validateWaypointsInsideMap(map),
          validatePointsNotBlocked(expanded),
          (data) => fromPromise(() => waypointRepository.createWaypoint(data))
        )(waypointData);
      })),


  createMultipleWaypoints: (map, waypointsData) =>
    fromPromise(() => obstacleRepository.findByMapId(map.id))
      .then(ResultMonad.chain((obstacles) => {

        const expanded = expandObstacles(obstacles);

        return pipe(
          checkEach(validateWaypointData),
          checkEach(validateWaypointsInsideMap(map)),
          checkEach(validatePointsNotBlocked(expanded)),
          (data) =>
            fromPromise(() =>
              waypointRepository.createMultipleWaypoints(data)
            )
        )(waypointsData);

      })),

  fetchAllWaypoints: () => 
    fromPromise(() => waypointRepository.getAllWaypoints()),

  fetchWaypointById: (id) =>
    fromPromise(() => waypointRepository.getWaypointById(id))
      .then(result => ResultMonad.chain(ensureFound('Waypoint not found'))(result)),

  modifyWaypointById: (id, updateData) =>
    fromPromise(() => waypointRepository.updateWaypointById(id, updateData))
      .then(result => ResultMonad.chain(ensureFound('Waypoint to update not found'))(result)),

  removeWaypointById: (id) =>
    fromPromise(() => waypointRepository.deleteWaypointById(id))
      .then(result => ResultMonad.chain(ensureFound('Waypoint to remove not found'))(result)),
});