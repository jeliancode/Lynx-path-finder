import * as waypointService from '../../application/services/waypointService.js'

export const createWaypoint = async (req, res) => {
    try {
        const { name, x, y, mapId } = req.body;
        const newWaypoint = await waypointService.createNewWaypoint({ name, x, y, mapId });

        res.status(201).json({
            success: true,
            data: newWaypoint
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const createMultipleWaypoints = async (req, res) => {
    try {
        const waypointsData = req.body;
        const newWaypoints = await waypointService.createMultipleWaypoints(waypointsData);

        res.status(201).json({
            success: true,
            data: newWaypoints
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllWaypoints = async (req, res) => {
    try {
        const waypoints = await waypointService.fetchAllWaypoints();

        res.status(200).json({
            success: true,
            data: waypoints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWaypointById = async (req, res) => {
    try {
        const { id } = req.params;
        const waypoint = await waypointService.fetchWaypointById(id);

        res.status(200).json({
            success: true,
            data: waypoint
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateWaypoint = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedWaypoint = await waypointService.modifyWaypointById(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedWaypoint
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteWaypoint = async (req, res) => {
    try {
        const { id } = req.params;
        await waypointService.removeWaypointById(id);

        res.status(200).json({
            success: true,
            message: 'Waypoint eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
