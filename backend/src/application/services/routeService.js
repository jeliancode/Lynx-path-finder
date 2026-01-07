import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import { fetchMapById } from './mapService.js';
import { calculateAStarPath } from '../../utils/pathFinder.js';
import { validateMapConfiguration } from '../../utils/mapValidator.js';
import { validateStartEndPoints } from '../../utils/routesConstraints.js';
import { validateWaypointsReachable } from '../../utils/wayPointValidator.js';

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
    const map = await fetchMapById(validatedData.mapId);
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

export const validateRoute = async (routeId) => {
    const route = await routeRepository.getRouteById(routeId);
    const mapId = route.mapId;
    const map = await fetchMapById(mapId);

    validateMapConfiguration(map);

    const startPoint = {x: route.startX, y: route.startY};
    const endPoint = {x: route.endX, y: route.endY};
    const mapObstacles = map.obstacles;

    validateStartEndPoints(startPoint, endPoint, mapObstacles);

    const waypoints = map.waypoints;
    const path = route.path;

    validateWaypointsReachable(path, waypoints);
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
