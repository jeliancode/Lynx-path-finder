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
import { Ok, Error } from '../../utils/funtional/monad.js';

describe('Obstacle Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewObstacle', () => {
    it('Should return Ok with created obstacle', async () => {
      const map = { id: '1' };
      const obstacleData = { x: 5, y: 4, width: 1, height: 2 };
      const createdObstacle = { id: '1', ...obstacleData };

      validateObstacleData.mockReturnValue(Ok(obstacleData));
      validateObstacleInsideMap.mockReturnValue(() => Ok(obstacleData));
      obstacleRepository.createObstacle.mockResolvedValue(createdObstacle);

      const result = await createNewObstacle(map, obstacleData);

      expect(validateObstacleData).toHaveBeenCalledWith(obstacleData);
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(obstacleRepository.createObstacle).toHaveBeenCalledWith(obstacleData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdObstacle);
    });

    it('Should return Error when obstacle data is invalid', async () => {
      const error = new Error('Invalid obstacle data');

      validateObstacleData.mockReturnValue(Error(error));

      const result = await createNewObstacle({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
      expect(obstacleRepository.createObstacle).not.toHaveBeenCalled();
    });
    it('Should return Error when obstacle is outside map', async () => {
      const error = new Error('Outside map');

      validateObstacleData.mockReturnValue(Ok({}));
      validateObstacleInsideMap.mockReturnValue(() => Error(error));

      const result = await createNewObstacle({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('createMultipleObstacles', () => {
    it('Should return Ok when all obstacles are valid', async () => {
      const map = { id: '1' };
      const obstacles = [
        { x: 1, y: 1 },
        { x: 2, y: 2 }
      ];

      const created = obstacles.map((o, i) => ({ id: `${i}`, ...o }));

      validateObstacleData.mockImplementation(o => Ok(o));
      validateObstacleInsideMap.mockReturnValue(() => Ok(obstacles));
      obstacleRepository.createMultipleObstacles.mockResolvedValue(created);

      const result = await createMultipleObstacles(map, obstacles);

      expect(validateObstacleData).toHaveBeenCalledTimes(obstacles.length);
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(obstacleRepository.createMultipleObstacles)
        .toHaveBeenCalledWith(obstacles);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(created);
    });

    it('Should return Error when one obstacle is invalid', async () => {
      const error = new Error('Invalid obstacle');

      validateObstacleData
        .mockReturnValueOnce(Ok({}))
        .mockReturnValueOnce(Error(error));

      const result = await createMultipleObstacles({}, [{}, {}]);

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('fetchAllObstacles', () => {
    it('Should return Ok with all obstacles', async () => {
      const obstacles = [{ id: '1' }];

      obstacleRepository.getAllObstacles.mockResolvedValue(obstacles);

      const result = await fetchAllObstacles();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(obstacles);
    });
  });

  describe('fetchObstacleById', () => {
    it('Should return Ok when obstacle exists', async () => {
      const obstacle = { id: '1' };

      obstacleRepository.getObstacleById.mockResolvedValue(obstacle);

      const result = await fetchObstacleById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(obstacle);
    });

    it('Should return Error when obstacle not found', async () => {
      obstacleRepository.getObstacleById.mockResolvedValue(null);

      const result = await fetchObstacleById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Obstacle not found');
    });
  });

  describe('modifyObstacleById', () => {
    it('Should return Ok when obstacle is updated', async () => {
      const updated = { id: '1', width: 2 };

      obstacleRepository.updateObstacleById.mockResolvedValue(updated);

      const result = await modifyObstacleById('1', { width: 2 });

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updated);
    });
  });

  describe('removeObstacleById', () => {
    it('Should return Ok with delete result', async () => {
      obstacleRepository.deleteObstacleById.mockResolvedValue(true);

      const result = await removeObstacleById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });
  });
});
