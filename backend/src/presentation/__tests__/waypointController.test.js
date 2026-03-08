import { waypointController } from '../controllers/waypointController.js';
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

describe('Waypoint Controller - Functional Logic Tests', () => {

  const setup = () => {
    const mockWaypointService = {
      createNewWaypoint: jest.fn(),
      createMultipleWaypoints: jest.fn(),
      fetchAllWaypoints: jest.fn(),
      fetchWaypointById: jest.fn(),
      modifyWaypointById: jest.fn(),
      removeWaypointById: jest.fn()
    };

    const controller = waypointController(mockWaypointService);
    
    const mockRes = {};
    const mockNext = jest.fn();

    const mockSuccessResponse = () => {
      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      return { messageFn, responseFn };
    };

    return { 
      controller, 
      mockWaypointService, 
      mockRes, 
      mockNext, 
      mockSuccessResponse 
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWaypoint', () => {
    it('Should correctly map request body and map context to the service', async () => {
      const { controller, mockWaypointService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = {
        body: { name: 'Punto A', x: 10, y: 20 },
        params: { mapId: 'm-1' },
        map: { id: 'm-1', name: 'Main Map' }
      };
      const created = { id: 'wp-1', ...req.body, mapId: 'm-1' };

      mockWaypointService.createNewWaypoint.mockResolvedValue(Ok(created));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createWaypoint(req, mockRes, mockNext);

      expect(mockWaypointService.createNewWaypoint).toHaveBeenCalledWith(
        req.map, 
        { ...req.body, mapId: 'm-1' }
      );
      expect(responseFn).toHaveBeenCalledWith(created);
    });
  });

  describe('createMultipleWaypoints', () => {
    it('Should transform an array of data into waypoints with mapId context', async () => {
      const { controller, mockWaypointService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();

      const req = {
        body: [{ name: 'A' }, { name: 'B' }],
        params: { mapId: 'map-99' },
        map: { id: 'map-99' }
      };
      const expectedData = req.body.map(wp => ({ ...wp, mapId: 'map-99' }));

      mockWaypointService.createMultipleWaypoints.mockResolvedValue(Ok(expectedData));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createMultipleWaypoints(req, mockRes, mockNext);

      expect(mockWaypointService.createMultipleWaypoints).toHaveBeenCalledWith(
        req.map, 
        expectedData
      );
      expect(messageFn).toHaveBeenCalledWith('Waypoints created successfully');
    });
  });

  describe('updateWaypoint', () => {
    it('Should call service with ID and return the updated entity', async () => {
      const { controller, mockWaypointService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = { params: { id: 'wp-1' }, body: { name: 'New Name' } };
      mockWaypointService.modifyWaypointById.mockResolvedValue(Ok({ id: 'wp-1', name: 'New Name' }));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.updateWaypoint(req, mockRes, mockNext);

      expect(mockWaypointService.modifyWaypointById).toHaveBeenCalledWith('wp-1', req.body);
      expect(responseFn).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }));
    });
  });

  describe('deleteWaypoint', () => {
    it('Should pass the result of deletion to the success utility', async () => {
      const { controller, mockWaypointService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();

      mockWaypointService.removeWaypointById.mockResolvedValue(Ok({ deleted: true }));
      deletedSuccessfully.mockReturnValue(messageFn);

      await controller.deleteWaypoint({ params: { id: 'wp-1' } }, mockRes, mockNext);

      expect(mockWaypointService.removeWaypointById).toHaveBeenCalledWith('wp-1');
      expect(responseFn).toHaveBeenCalledWith({ deleted: true });
    });
  });
});