import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import * as mapRepository from '../../infrastructure/repositories/mapRepository.js';
import { calculateAStarPath } from '../../utils/pathFinder.js';

const validateRouteData = (data) => {
    if (data.mapId <= 0) {
        throw new Error('Invalid route data: Map ID must be greater than 0 ');
    }
    if (data.distance <= 0) {
        throw new Error('Invalid route data: Distance must be greater than 0');
    }
    return data;
};

const validateMap = async (mapId) => {
    const map = await mapRepository.getMapById(mapId);
    if (!map) {
        throw new Error('El mapa especificado no existe');
    }
    return map;
}

export const createNewRoute = async (routeData) => {
    const validatedData = validateRouteData(routeData);
    const map = await validateMap(validatedData.mapId);

    const startPoint = {x: validatedData.startX, y: validatedData.startY};
    const endPoint = {x: validatedData.endX, y: validatedData.endY};

    const {path, distance} = calculateAStarPath(
        {
            width: map.width,
            height: map.height,
            obstacles: map.obstacles
        },
        startPoint,
        endPoint
    );

    const completeData = {
        ...validatedData,
        distance,
        path
    };

    return await routeRepository.createRoute(completeData);
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
