jest.mock(
  '../../infrastructure/repositories/routeRepository.js',
  () => ({
    createRoute: jest.fn(),
    getAllRoutes: jest.fn(),
    getRouteById: jest.fn(),
    updateRouteById: jest.fn(),
    deleteRouteById: jest.fn()
  })
);

jest.mock('../../utils/pathFinder/routeBuilder.js', () => ({
  buildRouteThroughWaypoints: jest.fn()
}));

jest.mock('../../utils/validator/reachableWaypointValidator.js', () => ({
  validateWaypointsReachable: jest.fn(() => jest.fn())
}));

jest.mock('../../utils/validator/mapConfigValidator.js', () => ({
  validateMapConfiguration: jest.fn()
}));

jest.mock('../../utils/validator/routePointsValidator.js', () => ({
  validateStartEndPoints: jest.fn(() => jest.fn(() => jest.fn()))
}));

import * as routeRepository from '../../infrastructure/repositories/routeRepository.js';
import { buildRouteThroughWaypoints } from '../../utils/pathFinder/routeBuilder.js';
import {
  createNewRoute,
  validateRouteWaypoints,
  fetchAllRoutes,
  fetchRouteById,
  modifyRouteById,
  removeRouteById
} from '../services/routeService.js';

describe('Map Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewRoute', () => {
    it('Should create a route with valid data', async () => {
      const map = {
        width: 10,
        height: 10,
        obstacles: [],
        waypoints: [{ x: 2, y: 2 }]
      };

      const routeData = {
        startX: 0,
        startY: 0,
        endX: 9,
        endY: 9
      };

      const mockPath = [{ x: 0, y: 0 }, { x: 9, y: 9 }];
      const mockDistance = 12;

      buildRouteThroughWaypoints.mockReturnValue({
        path: mockPath,
        distance: mockDistance
      });

      routeRepository.createRoute.mockResolvedValue({
        id: '1',
        ...routeData,
        path: mockPath,
        distance: mockDistance
      });

      const result = await createNewRoute(routeData, map);

      expect(buildRouteThroughWaypoints).toHaveBeenCalled();
      expect(routeRepository.createRoute).toHaveBeenCalledWith({
        ...routeData,
        path: mockPath,
        distance: mockDistance
      });
      expect(result.path).toEqual(mockPath);
    });
  });

  describe('validateRouteWaypoints', () => {
    it('Should validate that waypoints are reachable', async () => {
      const route = {
        path: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };

      const map = {
        waypoints: [{ x: 1, y: 1 }]
      };

      routeRepository.getRouteById.mockResolvedValue(route);

      await validateRouteWaypoints('1', map);

      expect(routeRepository.getRouteById).toHaveBeenCalledWith('1');
    });
  });

  describe('fetchAllRoutes', () => {
    it('Should return all routes', async () => {
      const routes = [{ id: '1' }, { id: '2' }];

      routeRepository.getAllRoutes.mockResolvedValue(routes);

      const result = await fetchAllRoutes();

      expect(routeRepository.getAllRoutes).toHaveBeenCalled();
      expect(result).toEqual(routes);
    });
  });

  describe('fetchRouteById', () => {
    it('Should return a route by id', async () => {
      const route = { id: '1' };

      routeRepository.getRouteById.mockResolvedValue(route);

      const result = await fetchRouteById('1');

      expect(routeRepository.getRouteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(route);
    });
  });

  describe('modifyRouteById', () => {
    it('Should update route and recalculate path', async () => {
      const map = {
        width: 10,
        height: 10,
        obstacles: [],
        waypoints: [{ x: 3, y: 3 }]
      };

      const existingRoute = {
        id: '1',
        startX: 0,
        startY: 0,
        endX: 5,
        endY: 5
      };

      const updateData = { endX: 9, endY: 9 };

      const mockPath = [{ x: 0, y: 0 }, { x: 9, y: 9 }];
      const mockDistance = 15;

      routeRepository.getRouteById.mockResolvedValue(existingRoute);
      routeRepository.updateRouteById.mockResolvedValue({
        ...existingRoute,
        ...updateData,
        path: mockPath,
        distance: mockDistance
      });

      buildRouteThroughWaypoints.mockReturnValue({
        path: mockPath,
        distance: mockDistance
      });

      const result = await modifyRouteById('1', updateData, map);

      expect(routeRepository.updateRouteById).toHaveBeenCalled();
      expect(result.path).toEqual(mockPath);
    });
  });

  describe('removeRouteById', () => {
    it('Should delete route', async () => {
      routeRepository.deleteRouteById.mockResolvedValue(true);

      const result = await removeRouteById('1');

      expect(routeRepository.deleteRouteById).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
