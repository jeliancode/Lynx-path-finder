jest.mock(
  '../../infrastructure/repositories/obstacleRepository.js',
  () => ({
    createObstacle: jest.fn(),
    createMultipleObstacles: jest.fn(),
    getAllObstacles: jest.fn(),
    getObstacleById: jest.fn(),
    updateObstacleById: jest.fn(),
    deleteObstacleById: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/entityDataValidator.js',
  () => ({
    validateObstacleData: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/insideMapValidator.js',
  () => ({
    validateObstacleInsideMap: jest.fn()
  })
);

import {
  createNewObstacle,
  createMultipleObstacles,
  fetchAllObstacles,
  fetchObstacleById,
  modifyObstacleById,
  removeObstacleById
} from '../services/obstacleService.js';

import * as obstacleRepository from '../../infrastructure/repositories/obstacleRepository.js';
import { validateObstacleData } from '../../utils/validator/entityDataValidator.js';
import { validateObstacleInsideMap } from '../../utils/validator/insideMapValidator.js';

describe('Obstacle Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewObstacle', () => {
    it('Should validate data and create obstacle', async () => {
      const map = { id: '1' };
      const obstacleData = { x: 5, y: 4, width: 1, height: 2 };
      const createdObstacle = { id: '1', ...obstacleData };

      validateObstacleData.mockReturnValue(undefined);
      validateObstacleInsideMap.mockReturnValue(() => undefined);
      obstacleRepository.createObstacle.mockResolvedValue(createdObstacle);

      const result = await createNewObstacle(map, obstacleData);

      expect(validateObstacleData).toHaveBeenCalledWith(obstacleData);
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(obstacleRepository.createObstacle)
        .toHaveBeenCalledWith(obstacleData);
      expect(result).toEqual(createdObstacle);
    });

    it('Should throw error if validateObstacleData throws', async () => {
      const map = {};
      const obstacleData = { x: 5 };

      validateObstacleData.mockImplementation(() => {
        throw new Error('Invalid obstacle data');
      });

      await expect(createNewObstacle(map, obstacleData))
        .rejects
        .toThrow('Invalid obstacle data');

      expect(obstacleRepository.createObstacle).not.toHaveBeenCalled();
    });
  });

  describe('createMultipleObstacles', () => {
    it('Should validate and create multiple obstacles', async () => {
      const map = { id: '1' };
      const obstaclesData = [
        { x: 1, y: 1, width: 1, height: 1 },
        { x: 2, y: 2, width: 1, height: 1 }
      ];

      const created = obstaclesData.map((o, i) => ({ id: `${i}`, ...o }));

      validateObstacleData.mockReturnValue(undefined);
      validateObstacleInsideMap.mockReturnValue(() => undefined);
      obstacleRepository.createMultipleObstacles.mockResolvedValue(created);

      const result = await createMultipleObstacles(map, obstaclesData);

      expect(validateObstacleData).toHaveBeenCalledTimes(obstaclesData.length);
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(obstacleRepository.createMultipleObstacles)
        .toHaveBeenCalledWith(obstaclesData);
      expect(result).toEqual(created);
    });
  });

  describe('fetchAllObstacles', () => {
    it('Should return all obstacles', async () => {
      const obstacles = [{ id: '1' }];

      obstacleRepository.getAllObstacles.mockResolvedValue(obstacles);

      const result = await fetchAllObstacles();

      expect(obstacleRepository.getAllObstacles).toHaveBeenCalled();
      expect(result).toEqual(obstacles);
    });
  });

  describe('fetchObstacleById', () => {
    it('Should return obstacle if exists', async () => {
      const obstacle = { id: '1' };

      obstacleRepository.getObstacleById.mockResolvedValue(obstacle);

      const result = await fetchObstacleById('1');

      expect(obstacleRepository.getObstacleById)
        .toHaveBeenCalledWith('1');
      expect(result).toEqual(obstacle);
    });

    it('Should throw error if obstacle not found', async () => {
      obstacleRepository.getObstacleById.mockResolvedValue(null);

      await expect(fetchObstacleById('999'))
        .rejects
        .toThrow('Obstacle not found');
    });
  });

  describe('modifyObstacleById', () => {
    it('Should update obstacle', async () => {
      const updateData = { width: 2 };
      const updated = { id: '1', ...updateData };

      obstacleRepository.updateObstacleById.mockResolvedValue(updated);

      const result = await modifyObstacleById('1', updateData);

      expect(obstacleRepository.updateObstacleById)
        .toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updated);
    });
  });

  describe('removeObstacleById', () => {
    it('Should delete obstacle', async () => {
      obstacleRepository.deleteObstacleById.mockResolvedValue(true);

      const result = await removeObstacleById('1');

      expect(obstacleRepository.deleteObstacleById)
        .toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
