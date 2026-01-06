import * as routeRepository from '../repositories/routeRepository.js';

const validateRouteData = (data) => {
    if (data.mapId <= 0) {
        throw new Error('Invalid route data: Map ID must be greater than 0 ');
    }
    if (data.distance <= 0) {
        throw new Error('Invalid route data: Distance must be greater than 0');
    }
    return data;
};

export const createNewRoute = async (routeData) => {
    const validatedData = validateRouteData(routeData);
    return await routeRepository.createRoute(validatedData);
};

export const fetchAllRoutes = async () => {
    return await routeRepository.getAllRoutes();
};

export const fetchRouteById = async (id) => {
    const route = await routeRepository.getRouteById(id);
    if (!route) throw new Error('Route not found');
    return route;
};

export const modifyRouteById = async (id, updateData) => { 
    const validatedData = validateRouteData(updateData);
    return await routeRepository.updateRouteById(id, validatedData);
};

export const removeRouteById = async (id) => {
    return await routeRepository.deleteRouteById(id);
};
