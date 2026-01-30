import * as routeService from '../../application/services/routeService.js';

export const createRoute = async (req, res, next) => {
    try {
        const { startX, startY, endX, endY} = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const newRoute = await routeService.createNewRoute({ mapId, startX, startY, endX, endY }, map);

        res.status(201).json({
            success: true,
            data: newRoute
        });
    } catch (error) {
        next(error);
    }
};

export const validateRouteWaypoints = async (req, res, next) => {
    try {
        const { id } = req.params;
        await routeService.validateRouteWaypoints(id);

        res.status(200).json({
            success: true,
            message: 'Route validation completed'
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRoutes = async (req, res, next) => {
    try {
        const routes = await routeService.fetchAllRoutes();

        res.status(200).json({
            success: true,
            data: routes
        });
    } catch (error) {
        next(error);
    }
};

export const getRouteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const route = await routeService.fetchRouteById(id);
        
        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        next(error);
    }
};

export const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedRoute = await routeService.modifyRouteById(id, updateData);
    
        res.status(200).json({
            success: true,
            data: updatedRoute
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;
        await routeService.removeRouteById(id);

        res.status(200).json({
            success: true,
            message: 'Route deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
