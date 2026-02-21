import { obstacleController } from '../controllers/obstacleController.js';
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

describe('Obstacle Controller - Strategy Based Tests', () => {

  const setup = () => {
    const mockObstacleService = {
      createNewObstacle: jest.fn(),
      createMultipleObstacles: jest.fn(),
      fetchAllObstacles: jest.fn(),
      fetchObstacleById: jest.fn(),
      modifyObstacleById: jest.fn(),
      removeObstacleById: jest.fn()
    };

    const controller = obstacleController(mockObstacleService);
    const mockRes = {};
    const mockNext = jest.fn();

    const mockSuccessResponse = () => {
      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      return { messageFn, responseFn };
    };

    return { 
      controller, 
      mockObstacleService, 
      mockRes, 
      mockNext, 
      mockSuccessResponse 
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createObstacle', () => {
    it('Should create a single obstacle and return success', async () => {
      const { controller, mockObstacleService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = {
        body: { x: 1, y: 1, width: 5, height: 5 },
        params: { mapId: 'map-123' },
        map: { id: 'map-123', width: 100, height: 100 }
      };
      const createdObstacle = { id: 'obs-1', ...req.body, mapId: 'map-123' };

      mockObstacleService.createNewObstacle.mockResolvedValue(Ok(createdObstacle));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createObstacle(req, mockRes, mockNext);

      expect(mockObstacleService.createNewObstacle).toHaveBeenCalledWith(
        req.map, 
        { ...req.body, mapId: 'map-123' }
      );
      expect(responseFn).toHaveBeenCalledWith(createdObstacle);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('createMultipleObstacles', () => {
    it('Should process a list of obstacles and map them correctly', async () => {
      const { controller, mockObstacleService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();

      const req = {
        body: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const obstaclesWithId = req.body.map(o => ({ ...o, mapId: 'map-1' }));

      mockObstacleService.createMultipleObstacles.mockResolvedValue(Ok(obstaclesWithId));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createMultipleObstacles(req, mockRes, mockNext);

      expect(mockObstacleService.createMultipleObstacles).toHaveBeenCalledWith(
        req.map, 
        obstaclesWithId
      );
      expect(messageFn).toHaveBeenCalledWith('Obstacles created successfully');
    });
  });

  describe('updateObstacle', () => {
    it('Should call service with ID and body, and return updated obstacle', async () => {
      const { controller, mockObstacleService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = { params: { id: 'obs-1' }, body: { width: 50 } };
      const updated = { id: 'obs-1', x: 0, y: 0, width: 50 };

      mockObstacleService.modifyObstacleById.mockResolvedValue(Ok(updated));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.updateObstacle(req, mockRes, mockNext);

      expect(mockObstacleService.modifyObstacleById).toHaveBeenCalledWith('obs-1', req.body);
      expect(responseFn).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteObstacle', () => {
    it('Should handle deletion and notify next on error monad', async () => {
      const { controller, mockObstacleService, mockRes, mockNext } = setup();
      const errorMsg = { status: 404, message: 'Obstacle not found' };

      mockObstacleService.removeObstacleById.mockResolvedValue(Error(errorMsg));

      await controller.deleteObstacle({ params: { id: 'obs-99' } }, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(errorMsg);
    });
  });
});