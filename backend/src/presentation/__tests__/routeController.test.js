import { routeController } from '../controllers/routeController.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/shared/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../domain/shared/error/httpSuccess.js';

describe('Route Controller - Clean Architecture Tests', () => {
  
  const setup = () => {
    const mockRouteService = {
      createNewRoute: jest.fn(),
      validateRouteWaypoints: jest.fn(),
      fetchAllRoutes: jest.fn(),
      fetchRouteById: jest.fn(),
      modifyRouteById: jest.fn(),
      removeRouteById: jest.fn()
    };

    const controller = routeController(mockRouteService);
    
    const mockRes = {};
    const mockNext = jest.fn();

    const mockSuccessResponse = () => {
      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      return { messageFn, responseFn };
    };

    return { 
      controller, 
      mockRouteService, 
      mockRes, 
      mockNext, 
      mockSuccessResponse 
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoute', () => {
    it('Should coordinate route creation with map context and body data', async () => {
      const { controller, mockRouteService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = {
        body: { startX: 1, startY: 1, endX: 5, endY: 5 },
        params: { mapId: 'map-abc' },
        map: { id: 'map-abc', obstacles: [] }
      };
      const createdRoute = { id: 'route-1', ...req.body };

      mockRouteService.createNewRoute.mockResolvedValue(Ok(createdRoute));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createRoute(req, mockRes, mockNext);

      expect(mockRouteService.createNewRoute).toHaveBeenCalledWith(
        { mapId: 'map-abc', ...req.body },
        req.map
      );
      expect(responseFn).toHaveBeenCalledWith(createdRoute);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateRouteWaypoints', () => {
    it('Should return success when route waypoints are valid within map constraints', async () => {
      const { controller, mockRouteService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = { params: { id: 'route-1' }, map: { id: 'map-1' } };
      mockRouteService.validateRouteWaypoints.mockResolvedValue(Ok());
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.validateRouteWaypoints(req, mockRes, mockNext);

      expect(mockRouteService.validateRouteWaypoints).toHaveBeenCalledWith('route-1', req.map);
      expect(messageFn).toHaveBeenCalledWith('Map waypoints validated successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });

  describe('updateRoute', () => {
    it('Should pass update data and map context to the service', async () => {
      const { controller, mockRouteService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = { 
        params: { id: 'route-1' }, 
        body: { endX: 10 }, 
        map: { id: 'map-1' } 
      };
      const updated = { id: 'route-1', endX: 10 };

      mockRouteService.modifyRouteById.mockResolvedValue(Ok(updated));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.updateRoute(req, mockRes, mockNext);

      expect(mockRouteService.modifyRouteById).toHaveBeenCalledWith('route-1', req.body, req.map);
      expect(responseFn).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteRoute', () => {
    it('Should propagate service errors to the global error handler', async () => {
      const { controller, mockRouteService, mockRes, mockNext } = setup();
      const serviceError = { status: 404, message: 'Route not found' };

      mockRouteService.removeRouteById.mockResolvedValue(Error(serviceError));

      await controller.deleteRoute({ params: { id: 'invalid' } }, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });
});