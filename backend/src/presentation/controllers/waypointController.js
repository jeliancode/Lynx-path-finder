import * as waypointService from '../../application/services/waypointService.js'

export const createWaypoint = async (req, res, next) => {
    try {
        const { name, x, y } = req.body;
        const { mapId } = req.params;
        const map = req.map;

        const newWaypoint = await waypointService.createNewWaypoint(map, { name, x, y, mapId });

        res.status(201).json({
            success: true,
            data: newWaypoint
        });
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

        res.status(201).json({
            success: true,
            data: newWaypoints
        });
    } catch (error) {
        next(error);
    }
};

export const getAllWaypoints = async (req, res, next) => {
    try {
        const waypoints = await waypointService.fetchAllWaypoints();

        res.status(200).json({
            success: true,
            data: waypoints
        });
    } catch (error) {
        next(error);
    }
};

export const getWaypointById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const waypoint = await waypointService.fetchWaypointById(id);

        res.status(200).json({
            success: true,
            data: waypoint
        });
    } catch (error) {
        next(error);
    }
};

export const updateWaypoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedWaypoint = await waypointService.modifyWaypointById(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedWaypoint
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWaypoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        await waypointService.removeWaypointById(id);

        res.status(200).json({
            success: true,
            message: 'Waypoint deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
