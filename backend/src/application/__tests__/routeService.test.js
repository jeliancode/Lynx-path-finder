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
import { validateMapConfiguration } from '../../utils/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../utils/validator/routePointsValidator.js';
import { validateWaypointsReachable } from '../../utils/validator/reachableWaypointValidator.js';
import { Ok, Error } from '../../utils/funtional/monad.js';

describe('Route Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewRoute', () => {
    it('Should return Ok with created route', async () => {
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

      validateMapConfiguration.mockReturnValue(Ok(map));
      validateStartEndPoints.mockImplementation(() =>
        () =>
          () =>
            Ok(routeData)
      );

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

      expect(result.isOk).toBe(true);
      expect(result.value.path).toEqual(mockPath);
      expect(result.value.distance).toBe(mockDistance);
    });
  });

  describe('validateRouteWaypoints', () => {
    it('Should return Ok when waypoints are reachable', async () => {
      const route = {
        path: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };

      const map = {
        waypoints: [{ x: 1, y: 1 }]
      };

      routeRepository.getRouteById.mockResolvedValue(route);
      validateWaypointsReachable.mockReturnValue(() => Ok(route));

      const result = await validateRouteWaypoints('1', map);

      expect(result.isOk).toBe(true);
    });
  });

  describe('fetchAllRoutes', () => {
    it('Should return Ok with all routes', async () => {
      const routes = [{ id: '1' }, { id: '2' }];

      routeRepository.getAllRoutes.mockResolvedValue(routes);

      const result = await fetchAllRoutes();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(routes);
    });
  });

  describe('fetchRouteById', () => {
    it('Should return Ok when route exists', async () => {
      const route = { id: '1' };

      routeRepository.getRouteById.mockResolvedValue(route);

      const result = await fetchRouteById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(route);
    });
    it('Should return Error when route does not exist', async () => {
      routeRepository.getRouteById.mockResolvedValue(null);

      const result = await fetchRouteById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Route not found');
    });
  });

  describe('modifyRouteById', () => {
    it('Should return Ok when route is updated and recalculated', async () => {
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

      validateMapConfiguration.mockReturnValue(Ok(map));
      validateStartEndPoints.mockImplementation(() =>
        () =>
          () =>
            Ok({
              ...existingRoute,
              ...updateData
            })
      );
      buildRouteThroughWaypoints.mockReturnValue({
        path: mockPath,
        distance: mockDistance
      });

      const result = await modifyRouteById('1', updateData, map);

      expect(result.isOk).toBe(true);
      expect(result.value.path).toEqual(mockPath);
      expect(result.value.distance).toBe(mockDistance);
    });
  });

  describe('removeRouteById', () => {
    it('Should return Ok with delete result', async () => {
      routeRepository.deleteRouteById.mockResolvedValue(true);

      const result = await removeRouteById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });
  });
});
