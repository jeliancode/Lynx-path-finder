import * as waypointRepository from '../../infrastructure/repositories/waypointRepository.js';
import { validateWaypointsInsideMap } from '../../utils/validator/insideMapValidator.js';
import { validateWaypointData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../utils/funtional/monad.js';
import pipe from '../../utils/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const createNewWaypoint = (map, waypointData) => 
  pipe(
    validateWaypointData,
    validateWaypointsInsideMap(map),
    (data) => fromPromise(() => waypointRepository.createWaypoint(data))
  )(waypointData);

export const createMultipleWaypoints = (map, waypointsData) =>
  pipe(
    (waypoints) => waypoints.reduce(
      (acc, waypoint) =>
        ResultMonad.chain(() =>
          ResultMonad.map(() => waypoints)(validateWaypointData(waypoint))
        )(acc),
        Ok(waypoints)
    ),
    validateWaypointsInsideMap(map),
    (data) => fromPromise(() => 
      waypointRepository.createMultipleWaypoints(data)
    )
  )(waypointsData);

export const fetchAllWaypoints = () => 
  fromPromise(() => waypointRepository.getAllWaypoints());

export const fetchWaypointById = (id) =>
  fromPromise(() => waypointRepository.getWaypointById(id))
    .then(result => ResultMonad.chain(ensureFound('Waypoint not found'))(result));

export const modifyWaypointById = (id, updateData) =>
  fromPromise(() => waypointRepository.updateWaypointById(id, updateData))
    .then(result => ResultMonad.chain(ensureFound('Waypoint to update not found'))(result));

export const removeWaypointById = (id) =>
  fromPromise(() => waypointRepository.deleteWaypointById(id));