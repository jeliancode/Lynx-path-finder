jest.mock('../../application/services/routeService.js', () => ({
  createNewRoute: jest.fn(),
  validateRouteWaypoints: jest.fn(),
  fetchAllRoutes: jest.fn(),
  fetchRouteById: jest.fn(),
  modifyRouteById: jest.fn(),
  removeRouteById: jest.fn()
}));

jest.mock('../../utils/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createRoute,
  validateRouteWaypoints,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from '../controllers/routeController.js';

import * as routeService from '../../application/services/routeService.js';
import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../utils/error/httpSuccess.js';
import { Ok, Error } from '../../utils/funtional/monad.js';

const mockRes = () => ({});
const mockNext = jest.fn();

describe('Route Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoute', () => {
    it('Should create route successfully', async () => {
      const req = {
        body: { startX: 1, startY: 1, endX: 5, endY: 5 },
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      const createdRoute = { id: '1', ...req.body, mapId: 'map-1' };

      routeService.createNewRoute.mockResolvedValue(Ok(createdRoute));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createRoute(req, res, mockNext);

      expect(routeService.createNewRoute).toHaveBeenCalledWith(
        { mapId: 'map-1', ...req.body },
        req.map
      );
      expect(createdSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('Route created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdRoute);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should call next(error) if service fails', async () => {
      const error = new Error('Error');
      const req = { body: {}, params: {}, map: {} };
      const res = mockRes();

      routeService.createNewRoute.mockResolvedValue(Error(error));

      await createRoute(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('validateRouteWaypoints', () => {
    it('Should validate route waypoints successfully', async () => {
      const req = {
        params: { id: 'route-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      routeService.validateRouteWaypoints.mockResolvedValue(Ok());

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await validateRouteWaypoints(req, res, mockNext);

      expect(routeService.validateRouteWaypoints).toHaveBeenCalledWith('route-1', req.map);
      expect(messageFn).toHaveBeenCalledWith('Map waypoints validated successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });

  describe('getAllRoutes', () => {
    it('Should return all routes', async () => {
      const req = {};
      const res = mockRes();
      const routes = [{ id: '1' }, { id: '2' }];

      routeService.fetchAllRoutes.mockResolvedValue(Ok(routes));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getAllRoutes(req, res, mockNext);

      expect(routeService.fetchAllRoutes).toHaveBeenCalled();
      expect(messageFn).toHaveBeenCalledWith('All routes get successfully');
      expect(responseFn).toHaveBeenCalledWith(routes);
    });
  });

  describe('getRouteById', () => {
    it('Should return route by id', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();
      const route = { id: '1' };

      routeService.fetchRouteById.mockResolvedValue(Ok(route));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getRouteById(req, res, mockNext);

      expect(routeService.fetchRouteById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Route get successfully');
      expect(responseFn).toHaveBeenCalledWith(route);
    });
  });

  describe('updateRoute', () => {
    it('Should update route successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { startX: 2 },
        map: { id: 'map-1' }
      };
      const res = mockRes();
      const updatedRoute = { id: '1', ...req.body };

      routeService.modifyRouteById.mockResolvedValue(Ok(updatedRoute));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await updateRoute(req, res, mockNext);

      expect(routeService.modifyRouteById).toHaveBeenCalledWith('1', req.body, req.map);
      expect(messageFn).toHaveBeenCalledWith('Route updated successfully');
      expect(responseFn).toHaveBeenCalledWith(updatedRoute);
    });
  });

  describe('deleteRoute', () => {
    it('Should delete route successfully', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      routeService.removeRouteById.mockResolvedValue(Ok(true));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      deletedSuccessfully.mockReturnValue(messageFn);

      await deleteRoute(req, res, mockNext);

      expect(routeService.removeRouteById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Route deleted successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });
});
