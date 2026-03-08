import { obstacleService } from '../services/obstacleService.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/validator/obstacleDataValidator.js');
jest.mock('../../domain/validator/insideMapValidator.js');
jest.mock('../../domain/validator/listValidator.js');

import validateObstacleData from '../../domain/validator/obstacleDataValidator.js';
import { validateObstacleInsideMap } from '../../domain/validator/insideMapValidator.js';
import checkEach from '../../domain/validator/listValidator.js';

describe('Obstacle Service - Full Suite', () => {

  const setup = () => {
    const mockObstacleRepository = {
      createObstacle: jest.fn(),
      createMultipleObstacles: jest.fn(),
      getAllObstacles: jest.fn(),
      getObstacleById: jest.fn(),
      updateObstacleById: jest.fn(),
      deleteObstacleById: jest.fn()
    };

    const service = obstacleService({
      obstacleRepository: mockObstacleRepository
    });

    return { service, mockObstacleRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewObstacle', () => {

    it('Should return Ok with created obstacle', async () => {
      const { service, mockObstacleRepository } = setup();

      const map = { id: '1' };
      const obstacleData = { x: 5, y: 4 };
      const createdObstacle = { id: '1', ...obstacleData };

      validateObstacleData.mockReturnValue(Ok(obstacleData));
      validateObstacleInsideMap.mockReturnValue(() => Ok(obstacleData));
      mockObstacleRepository.createObstacle.mockResolvedValue(createdObstacle);

      const result = await service.createNewObstacle(map, obstacleData);

      expect(validateObstacleData).toHaveBeenCalledWith(obstacleData);
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(mockObstacleRepository.createObstacle)
        .toHaveBeenCalledWith(obstacleData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdObstacle);
    });

    it('Should return Error when obstacle data is invalid', async () => {
      const { service, mockObstacleRepository } = setup();

      const validationError = { message: 'Invalid obstacle' };

      validateObstacleData.mockReturnValue(Error(validationError));

      const result = await service.createNewObstacle({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(validationError);
      expect(mockObstacleRepository.createObstacle).not.toHaveBeenCalled();
    });

    it('Should return Error when obstacle is outside map', async () => {
      const { service } = setup();

      const outsideError = { message: 'Outside map' };

      validateObstacleData.mockReturnValue(Ok({}));
      validateObstacleInsideMap.mockReturnValue(() => Error(outsideError));

      const result = await service.createNewObstacle({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(outsideError);
    });

  });

  describe('createMultipleObstacles', () => {

    it('Should return Ok when all obstacles are valid', async () => {
      const { service, mockObstacleRepository } = setup();
      const map = { id: '1' };
      const obstacles = [{ x: 1 }, { x: 2 }];
      const created = obstacles.map((o, i) => ({ id: i, ...o }));

      checkEach.mockImplementation(() => () => Ok(obstacles));

      validateObstacleInsideMap.mockReturnValue(() => Ok(obstacles));
      mockObstacleRepository.createMultipleObstacles
        .mockResolvedValue(created);

      const result = await service.createMultipleObstacles(map, obstacles);

      expect(checkEach).toHaveBeenCalled();
      expect(validateObstacleInsideMap).toHaveBeenCalledWith(map);
      expect(mockObstacleRepository.createMultipleObstacles)
        .toHaveBeenCalledWith(obstacles);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(created);
    });

    it('Should return Error when one obstacle is invalid', async () => {
      const { service } = setup();
      const error = { message: 'Invalid obstacle' };

      checkEach.mockImplementation(() => () => Error(error));

      const result = await service.createMultipleObstacles({}, [{}, {}]);

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(error);
    });

  });

  describe('fetchAllObstacles', () => {

    it('Should return Ok with all obstacles', async () => {
      const { service, mockObstacleRepository } = setup();

      const obstacles = [{ id: '1' }];

      mockObstacleRepository.getAllObstacles
        .mockResolvedValue(obstacles);

      const result = await service.fetchAllObstacles();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(obstacles);
    });

  });

  describe('fetchObstacleById', () => {

    it('Should return Ok when obstacle exists', async () => {
      const { service, mockObstacleRepository } = setup();

      const obstacle = { id: '1' };

      mockObstacleRepository.getObstacleById
        .mockResolvedValue(obstacle);

      const result = await service.fetchObstacleById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(obstacle);
    });

    it('Should return Error when obstacle not found', async () => {
      const { service, mockObstacleRepository } = setup();

      mockObstacleRepository.getObstacleById
        .mockResolvedValue(null);

      const result = await service.fetchObstacleById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Obstacle not found');
    });

  });

  describe('modifyObstacleById', () => {

    it('Should return Ok when obstacle is updated', async () => {
      const { service, mockObstacleRepository } = setup();

      const updated = { id: '1', width: 2 };

      mockObstacleRepository.updateObstacleById
        .mockResolvedValue(updated);

      const result = await service.modifyObstacleById('1', { width: 2 });

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updated);
    });

    it('Should return Error when obstacle to update not found', async () => {
      const { service, mockObstacleRepository } = setup();

      mockObstacleRepository.updateObstacleById
        .mockResolvedValue(null);

      const result = await service.modifyObstacleById('1', {});

      expect(result.isError).toBe(true);
      expect(result.value.message)
        .toBe('Obstacle to update not found');
    });

  });

  describe('removeObstacleById', () => {

    it('Should return Ok when obstacle is deleted', async () => {
      const { service, mockObstacleRepository } = setup();

      mockObstacleRepository.deleteObstacleById
        .mockResolvedValue(true);

      const result = await service.removeObstacleById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('Should return Error when obstacle to delete not found', async () => {
      const { service, mockObstacleRepository } = setup();

      mockObstacleRepository.deleteObstacleById
        .mockResolvedValue(null);

      const result = await service.removeObstacleById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message)
        .toBe('Obstacle to delete not found');
    });
  });
});
