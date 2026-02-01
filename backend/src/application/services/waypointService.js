import * as waypointRepository from '../../infrastructure/repositories/waypointRepository.js';
import { validateWaypointsInsideMap } from '../../utils/validator/insideMapValidator.js';
import { validateWaypointData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';

export const createNewWaypoint = async (map, waypointData) => {
    validateWaypointData(waypointData);
    validateWaypointsInsideMap(map)(waypointData);
    return await waypointRepository.createWaypoint(waypointData);
};

export const createMultipleWaypoints = async (map, waypointsData) => {
    waypointsData.map(data => validateWaypointData(data));
    validateWaypointsInsideMap(map)(waypointsData);
    return await waypointRepository.createMultipleWaypoints(waypointsData);
};

export const fetchAllWaypoints = async () => {
    return await waypointRepository.getAllWaypoints();
};

export const fetchWaypointById = async (id) => {
    const waypoint = await waypointRepository.getWaypointById(id);
    if (!waypoint) notFoundError('Waypoint not found');
    return waypoint;
};

export const modifyWaypointById = async (id, updateData) => { 
    return await waypointRepository.updateWaypointById(id, updateData);
};

export const removeWaypointById = async (id) => {
    return await waypointRepository.deleteWaypointById(id);
};
