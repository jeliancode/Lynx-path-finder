import * as routeService from '../../application/services/routeService.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createRoute = async (req, res, next) => {
    try {
        const { startX, startY, endX, endY} = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const newRoute = await routeService.createNewRoute({ mapId, startX, startY, endX, endY }, map);

        createdSuccessfully(res)('Route created successfully')(newRoute);
    } catch (error) {
        next(error);
    }
};

export const validateRouteWaypoints = async (req, res, next) => {
    try {
        const { id } = req.params;
        const map = req.map;
        await routeService.validateRouteWaypoints(id, map);

        completedSuccessfully(res)('Map waypoints validated successfully')();
    } catch (error) {
        next(error);
    }
};

export const getAllRoutes = async (req, res, next) => {
    try {
        const routes = await routeService.fetchAllRoutes();

        completedSuccessfully(res)('All routes get successfully')(routes);
    } catch (error) {
        next(error);
    }
};

export const getRouteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const route = await routeService.fetchRouteById(id);
        
        completedSuccessfully(res)('Route get successfully')(route);
    } catch (error) {
        next(error);
    }
};

export const updateRoute = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedRoute = await routeService.modifyRouteById(id, updateData);
    
        completedSuccessfully(res)('Route updated successfully')(updatedRoute);
    } catch (error) {
        next(error);
    }
};

export const deleteRoute = async (req, res, next) => {
    try {
        const { id } = req.params;
        await routeService.removeRouteById(id);

        completedSuccessfully(res)('Route deleted successfully')();
    } catch (error) {
        next(error);
    }
};
