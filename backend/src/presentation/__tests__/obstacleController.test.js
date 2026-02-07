jest.mock('../../application/services/obstacleService.js', () => ({
  createNewObstacle: jest.fn(),
  createMultipleObstacles: jest.fn(),
  fetchAllObstacles: jest.fn(),
  fetchObstacleById: jest.fn(),
  modifyObstacleById: jest.fn(),
  removeObstacleById: jest.fn()
}));

jest.mock('../../utils/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createObstacle,
  createMultipleObstacles,
  getAllObstacles,
  getObstacleById,
  updateObstacle,
  deleteObstacle
} from '../controllers/obstacleController.js';

import * as obstacleService from '../../application/services/obstacleService.js';
import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../utils/error/httpSuccess.js';

const mockRes = () => ({});
const mockNext = jest.fn();

describe('Obstacle Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createObstacle', () => {
    it('Should create obstacle successfully', async () => {
      const req = {
        body: { x: 1, y: 2, width: 10, height: 5 },
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      const obstacle = { id: '1', ...req.body, mapId: 'map-1' };

      obstacleService.createNewObstacle.mockResolvedValue(obstacle);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createObstacle(req, res, mockNext);

      expect(obstacleService.createNewObstacle)
        .toHaveBeenCalledWith(req.map, { ...req.body, mapId: 'map-1' });

      expect(createdSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('Obstacle created successfully');
      expect(responseFn).toHaveBeenCalledWith(obstacle);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should throw error if service fails', async () => {
      const error = new Error('Error');
      obstacleService.createNewObstacle.mockRejectedValue(error);

      const req = { body: {}, params: {}, map: {} };
      const res = mockRes();

      await createObstacle(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createMultipleObstacles', () => {
    it('Should create multiple obstacles successfully', async () => {
      const req = {
        body: [
          { x: 1, y: 1, width: 5, height: 5 },
          { x: 2, y: 2, width: 6, height: 6 }
        ],
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      const obstacles = req.body.map(o => ({ ...o, mapId: 'map-1' }));

      obstacleService.createMultipleObstacles.mockResolvedValue(obstacles);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createMultipleObstacles(req, res, mockNext);

      expect(obstacleService.createMultipleObstacles).toHaveBeenCalledWith(req.map, obstacles);
      expect(messageFn).toHaveBeenCalledWith('Obstacles created successfully');
      expect(responseFn).toHaveBeenCalledWith(obstacles);
    });
  });

  describe('getAllObstacles', () => {
    it('Should return all obstacles', async () => {
      const req = {};
      const res = mockRes();
      const obstacles = [{ id: '1' }, { id: '2' }];

      obstacleService.fetchAllObstacles.mockResolvedValue(obstacles);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getAllObstacles(req, res, mockNext);

      expect(obstacleService.fetchAllObstacles).toHaveBeenCalled();
      expect(messageFn).toHaveBeenCalledWith('All obstacles get successfully');
      expect(responseFn).toHaveBeenCalledWith(obstacles);
    });
  });

  describe('getObstacleById', () => {
    it('Should return obstacle by id', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();
      const obstacle = { id: '1' };

      obstacleService.fetchObstacleById.mockResolvedValue(obstacle);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getObstacleById(req, res, mockNext);

      expect(obstacleService.fetchObstacleById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Obstacle get successfully');
      expect(responseFn).toHaveBeenCalledWith(obstacle);
    });
  });

  describe('updateObstacle', () => {
    it('Should update obstacle successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { width: 20 }
      };
      const res = mockRes();

      const updatedObstacle = { id: '1', width: 3 };

      obstacleService.modifyObstacleById.mockResolvedValue(updatedObstacle);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await updateObstacle(req, res, mockNext);

      expect(obstacleService.modifyObstacleById).toHaveBeenCalledWith('1', req.body);
      expect(messageFn).toHaveBeenCalledWith('Obstacle updated successfully');
      expect(responseFn).toHaveBeenCalledWith(updatedObstacle);
    });
  });

  describe('deleteObstacle', () => {
    it('Should delete obstacle successfully', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      obstacleService.removeObstacleById.mockResolvedValue(true);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      deletedSuccessfully.mockReturnValue(messageFn);

      await deleteObstacle(req, res, mockNext);

      expect(obstacleService.removeObstacleById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Obstacle deleted successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });
});
