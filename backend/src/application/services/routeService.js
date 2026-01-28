import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import { fetchMapById } from './mapService.js';
import { buildRouteThroughWaypoints } from '../../utils/pathFinder/routeBuilder.js';
import { validateWaypointsReachable } from '../../utils/validator/wayPointValidator.js';
import { validateMapConfiguration } from '../../utils/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../utils/validator/routePointsValidator.js';

export const createNewRoute = async (routeData, map) => {
    validateMapConfiguration(map);

    const startPoint = {x: routeData.startX, y: routeData.startY};
    const endPoint = {x: routeData.endX, y: routeData.endY};
    const obstacles = map.obstacles;

    validateStartEndPoints(obstacles)(startPoint)(endPoint);
    
    const waypoints = map.waypoints.map(wp => ({
        x: wp.x,
        y: wp.y
    }));

    const { path, distance } = buildRouteThroughWaypoints(
        {
            width: map.width,
            height: map.height,
            obstacles: map.obstacles
        },
        startPoint,
        waypoints,
        endPoint
    );

    const completeData = {
        ...routeData,
        distance,
        path
    }; 

    return await routeRepository.createRoute(completeData);
};

export const validateRouteWaypoints = async (routeId) => {
    const route = await routeRepository.getRouteById(routeId);
    const mapId = route.mapId;
    const map = await fetchMapById(mapId);
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
