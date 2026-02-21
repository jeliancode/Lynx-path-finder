import { ResultMonad } from '../../domain/shared/funtional/monad.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../domain/shared/error/httpSuccess.js';

export const waypointController = (waypointService) => ({
    createWaypoint: async (req, res, next) => {
        const { name, x, y } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const creationResult = await waypointService.createNewWaypoint(map, { name, x, y, mapId });

        ResultMonad.fold(
            (error) => next(error),
            (newWaypoint) => createdSuccessfully(res)('Waypoint created successfully')(newWaypoint)
        )(creationResult);
    },

    createMultipleWaypoints: async (req, res, next) => {
        const waypointsData = req.body;
        const map = req.map;
        const { mapId } = req.params;
        const waypointsWithMapId = waypointsData.map(waypoint => ({
            ...waypoint,
            mapId
        }));
        const creationResult = await waypointService.createMultipleWaypoints(map, waypointsWithMapId);

        ResultMonad.fold(
            (error) => next(error),
            (newWaypoints) => createdSuccessfully(res)('Waypoints created successfully')(newWaypoints)
        )(creationResult);
    },

    getAllWaypoints: async (req, res, next) => {
        const getResult = await waypointService.fetchAllWaypoints();

        ResultMonad.fold(
            (error) => next(error),
            (waypoints) => completedSuccessfully(res)('All waypoints get successfully')(waypoints)
        )(getResult);
    },

    getWaypointById: async (req, res, next) => {
        const { id } = req.params;
        const getResult = await waypointService.fetchWaypointById(id);

        ResultMonad.fold(
            (error) => next(error),
            (waypoint) => completedSuccessfully(res)('Waypoint get successfully')(waypoint)
        )(getResult);
    },

    updateWaypoint: async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const updateResult = await waypointService.modifyWaypointById(id, updateData);

        ResultMonad.fold(
            (error) => next(error),
            (updatedWaypoint) => completedSuccessfully(res)('Waypoint updated successfully')(updatedWaypoint)
        )(updateResult);
    },

    deleteWaypoint: async (req, res, next) => {
        const { id } = req.params;
        const deleteResult = await waypointService.removeWaypointById(id);

        ResultMonad.fold(
            (error) => next(error),
            (deletedWaypoint) => deletedSuccessfully(res)('Waypoint deleted successfully')(deletedWaypoint)
        )(deleteResult);
    },
})