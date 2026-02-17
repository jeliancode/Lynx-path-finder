import { routeService } from '../services/routeService.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/pathFinder/routeBuilder.js');
jest.mock('../../domain/validator/reachableWaypointValidator.js');
jest.mock('../../domain/validator/mapConfigValidator.js');
jest.mock('../../domain/validator/routePointsValidator.js');

import buildRouteThroughWaypoints from '../../domain/pathFinder/routeBuilder.js';
import { validateMapConfiguration } from '../../domain/validator/mapConfigValidator.js';
import { validateStartEndPoints } from '../../domain/validator/routePointsValidator.js';
import { validateWaypointsReachable } from '../../domain/validator/reachableWaypointValidator.js';

describe('Route Service - Full Suite', () => {

  const setup = () => {
    const mockRouteRepository = {
      createRoute: jest.fn(),
      getAllRoutes: jest.fn(),
      getRouteById: jest.fn(),
      updateRouteById: jest.fn(),
      deleteRouteById: jest.fn()
    };

    const service = routeService({
      routeRepository: mockRouteRepository
    });

    return { service, mockRouteRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewRoute', () => {

    it('Should return Ok with created route', async () => {
      const { service, mockRouteRepository } = setup();

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

      buildRouteThroughWaypoints.mockReturnValue(() =>
        ({ path: mockPath, distance: mockDistance })
      );

      mockRouteRepository.createRoute.mockResolvedValue({
        id: '1',
        ...routeData,
        path: mockPath,
        distance: mockDistance
      });

      const result = await service.createNewRoute(routeData, map);

      expect(result.isOk).toBe(true);
      expect(result.value.path).toEqual(mockPath);
      expect(result.value.distance).toBe(mockDistance);
    });

  });

  describe('validateRouteWaypoints', () => {

    it('Should return Ok when waypoints are reachable', async () => {
      const { service, mockRouteRepository } = setup();

      const route = {
        path: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };

      const map = {
        waypoints: [{ x: 1, y: 1 }]
      };

      mockRouteRepository.getRouteById.mockResolvedValue(route);

      validateWaypointsReachable.mockImplementation(() =>
        () =>
          Ok(route)
      );

      const result = await service.validateRouteWaypoints('1', map);

      expect(result.isOk).toBe(true);
    });

  });

  describe('fetchAllRoutes', () => {

    it('Should return Ok with all routes', async () => {
      const { service, mockRouteRepository } = setup();

      const routes = [{ id: '1' }, { id: '2' }];

      mockRouteRepository.getAllRoutes.mockResolvedValue(routes);

      const result = await service.fetchAllRoutes();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(routes);
    });

  });

  describe('fetchRouteById', () => {

    it('Should return Ok when route exists', async () => {
      const { service, mockRouteRepository } = setup();

      const route = { id: '1' };

      mockRouteRepository.getRouteById.mockResolvedValue(route);

      const result = await service.fetchRouteById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(route);
    });

    it('Should return Error when route does not exist', async () => {
      const { service, mockRouteRepository } = setup();

      mockRouteRepository.getRouteById.mockResolvedValue(null);

      const result = await service.fetchRouteById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Route not found');
    });

  });

  describe('modifyRouteById', () => {

    it('Should return Ok when route is updated and recalculated', async () => {
      const { service, mockRouteRepository } = setup();

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

      mockRouteRepository.getRouteById.mockResolvedValue(existingRoute);

      validateMapConfiguration.mockReturnValue(Ok(map));

      validateStartEndPoints.mockImplementation(() =>
        () =>
          () =>
            Ok({ ...existingRoute, ...updateData })
      );

      buildRouteThroughWaypoints.mockReturnValue(() =>
        ({ path: mockPath, distance: mockDistance })
      );

      mockRouteRepository.updateRouteById.mockResolvedValue({
        ...existingRoute,
        ...updateData,
        path: mockPath,
        distance: mockDistance
      });

      const result = await service.modifyRouteById('1', updateData, map);

      expect(result.isOk).toBe(true);
      expect(result.value.path).toEqual(mockPath);
      expect(result.value.distance).toBe(mockDistance);
    });

  });

  describe('removeRouteById', () => {

    it('Should return Ok with delete result', async () => {
      const { service, mockRouteRepository } = setup();

      mockRouteRepository.deleteRouteById.mockResolvedValue(true);

      const result = await service.removeRouteById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('Should return Error when route to delete not found', async () => {
      const { service, mockRouteRepository } = setup();

      mockRouteRepository.deleteRouteById.mockResolvedValue(null);

      const result = await service.removeRouteById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message)
        .toBe('Route to delete not found');
    });

  });

});
