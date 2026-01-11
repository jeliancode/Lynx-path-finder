import * as mapRepository from '../infrastructure/repositories/mapRepository.js';
import { validateMapConfiguration } from './mapValidator.js';
import { validateStartEndPoints } from './routesConstraints.js';

export const validateRoute = async (routeData) => {
    const map = await mapRepository.getMapById(routeData.mapId);
    if (!map) throw new Error('Mapa no existe');

    validateMapConfiguration(map);

    validateStartEndPoints(
        { x: routeData.startX, y: routeData.startY },
        { x: routeData.endX, y: routeData.endY },
        map.obstacles
    );

    if (!map.waypoints || map.waypoints.length === 0) {
        throw new Error('La ruta requiere al menos un punto de parada');
    }

    return map;
};
