import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import { buildRouteThroughWaypoints } from '../../utils/pathFinder/routeBuilder.js';
import { validateWaypointsReachable } from '../../utils/validator/reachableWaypointValidator.js';
import { validateMapConfiguration } from '../../utils/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../utils/validator/routePointsValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';

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
        path,
    }; 

    return await routeRepository.createRoute(completeData);
};

export const validateRouteWaypoints = async (routeId, map) => {
    const route = await routeRepository.getRouteById(routeId);
    const waypoints = map.waypoints;
    const path = route.path;

    validateWaypointsReachable(path)(waypoints);
};

export const fetchAllRoutes = async () => {
    return await routeRepository.getAllRoutes();
};

export const fetchRouteById = async (id) => { 
    const route = await routeRepository.getRouteById(id);
    if (!route) throw notFoundError('Route not found');
    return route;
};

export const modifyRouteById = async (id, updateData, map) => {
    const existingRoute = await routeRepository.getRouteById(id);
    if (!existingRoute) throw notFoundError('Route not found');

    validateMapConfiguration(map);

    const startPoint = {
        x: updateData.startX ?? existingRoute.startX,
        y: updateData.startY ?? existingRoute.startY
    };

    const endPoint = {
        x: updateData.endX ?? existingRoute.endX,
        y: updateData.endY ?? existingRoute.endY
    };

    validateStartEndPoints(map.obstacles)(startPoint)(endPoint);

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


    const completeUpdate = {
        ...updateData,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        path,
        distance
    };

    return await routeRepository.updateRouteById(id, completeUpdate);
};

export const removeRouteById = async (id) => {
    return await routeRepository.deleteRouteById(id);
};
