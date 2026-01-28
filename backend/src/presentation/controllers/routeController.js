import * as routeService from '../../application/services/routeService.js';

export const createRoute = async (req, res) => {
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
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const validateRouteWaypoints = async (req, res) => {
    try {
        const { id } = req.params;
        await routeService.validateRouteWaypoints(id);

        res.status(200).json({
            success: true,
            message: 'Ruta validada exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllRoutes = async (req, res) => {
    try {
        const routes = await routeService.fetchAllRoutes();

        res.status(200).json({
            success: true,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await routeService.fetchRouteById(id);
        
        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
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
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;
        await routeService.removeRouteById(id);

        res.status(200).json({
            success: true,
            message: 'Ruta eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
