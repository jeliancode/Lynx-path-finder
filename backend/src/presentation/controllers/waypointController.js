import * as waypointService from '../../application/services/waypointService.js'
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createWaypoint = async (req, res, next) => {
    try {
        const { name, x, y } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const newWaypoint = await waypointService.createNewWaypoint(map, { name, x, y, mapId });

        createdSuccessfully(res)('Waypoint created successfully')(newWaypoint);
    } catch (error) {
        next(error);
    }
};

export const createMultipleWaypoints = async (req, res, next) => {
    try {
        const waypointsData = req.body;
        const map = req.map;
        const { mapId } = req.params;
        const waypointsWithMapId = waypointsData.map(waypoint => ({
            ...waypoint,
            mapId
        }))
        const newWaypoints = await waypointService.createMultipleWaypoints(map, waypointsWithMapId);

        createdSuccessfully(res)('Waypoints created successfully')(newWaypoints);
    } catch (error) {
        next(error);
    }
};

export const getAllWaypoints = async (req, res, next) => {
    try {
        const waypoints = await waypointService.fetchAllWaypoints();

        completedSuccessfully(res)('All waypoints get successfully')(waypoints);
    } catch (error) {
        next(error);
    }
};

export const getWaypointById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const waypoint = await waypointService.fetchWaypointById(id);

        completedSuccessfully(res)('Waypoint get successfully')(waypoint);
    } catch (error) {
        next(error);
    }
};

export const updateWaypoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedWaypoint = await waypointService.modifyWaypointById(id, updateData);

        completedSuccessfully(res)('Waypoint updated successfully')(updatedWaypoint);
    } catch (error) {
        next(error);
    }
};

export const deleteWaypoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        await waypointService.removeWaypointById(id);

        deletedSuccessfully(res)('Waypoint deleted succcessfully');
    } catch (error) {
        next(error);
    }
};
