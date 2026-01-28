import * as waypointRepository from '../../infrastructure/repositories/waypointRepository.js';
import { validateWaypointsInsideMap } from '../../utils/validator/insideMapValidator.js';

const validateWaypointData = (data) => {
    if (data.mapId <= 0) {
        throw new Error('Invalid waypoint data: Map ID must be greater than 0 ');
    }
    if (data.name.length === 0) {
        throw new Error('Invalid waypoint data: Name cannot be empty');
    }
    return data;
}

export const createNewWaypoint = async (map, waypointData) => {
    const validatedData = validateWaypointData(waypointData);
    validateWaypointsInsideMap(map)(validatedData);
    return await waypointRepository.createWaypoint(validatedData);
};

export const createMultipleWaypoints = async (map, waypointsData) => {
    const validatedData = waypointsData.map(data => validateWaypointData(data));
    validateWaypointsInsideMap(map)(validatedData);
    return await waypointRepository.createMultipleWaypoints(validatedData);
};

export const fetchAllWaypoints = async () => {
    return await waypointRepository.getAllWaypoints();
};

export const fetchWaypointById = async (id) => {
    const waypoint = await waypointRepository.getWaypointById(id);
    if (!waypoint) throw new Error('Waypoint not found');
    return waypoint;
};

export const modifyWaypointById = async (id, updateData) => { 
    const validatedData = validateWaypointData(updateData);
    return await waypointRepository.updateWaypointById(id, validatedData);
};

export const removeWaypointById = async (id) => {
    return await waypointRepository.deleteWaypointById(id);
};
