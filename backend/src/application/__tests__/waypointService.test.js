import { waypointService } from '../services/waypointService.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/validator/waypointDataValidator.js');
jest.mock('../../domain/validator/insideMapValidator.js');
jest.mock('../../domain/validator/listValidator.js');

import validateWaypointData from '../../domain/validator/waypointDataValidator.js';
import { validateWaypointsInsideMap } from '../../domain/validator/insideMapValidator.js';
import checkEach from '../../domain/validator/listValidator.js';

describe('Waypoint Service - Full Suite', () => {

  const setup = () => {
    const mockWaypointRepository = {
      createWaypoint: jest.fn(),
      createMultipleWaypoints: jest.fn(),
      getAllWaypoints: jest.fn(),
      getWaypointById: jest.fn(),
      updateWaypointById: jest.fn(),
      deleteWaypointById: jest.fn()
    };

    const service = waypointService({
      waypointRepository: mockWaypointRepository
    });

    return { service, mockWaypointRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewWaypoint', () => {

    it('Should return Ok with created waypoint', async () => {
      const { service, mockWaypointRepository } = setup();

      const map = { id: '1' };
      const waypointData = { name: 'W1', x: 3, y: 3 };
      const createdWaypoint = { id: '1', ...waypointData };

      validateWaypointData.mockReturnValue(Ok(waypointData));
      validateWaypointsInsideMap.mockReturnValue(() => Ok(waypointData));
      mockWaypointRepository.createWaypoint.mockResolvedValue(createdWaypoint);

      const result = await service.createNewWaypoint(map, waypointData);

      expect(validateWaypointData).toHaveBeenCalledWith(waypointData);
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(mockWaypointRepository.createWaypoint)
        .toHaveBeenCalledWith(waypointData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdWaypoint);
    });

    it('Should return Error when waypoint data is invalid', async () => {
      const { service, mockWaypointRepository } = setup();

      const error = { message: 'Invalid waypoint data' };

      validateWaypointData.mockReturnValue(Error(error));

      const result = await service.createNewWaypoint({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(error);
      expect(mockWaypointRepository.createWaypoint).not.toHaveBeenCalled();
    });

    it('Should return Error when waypoint is outside map', async () => {
      const { service } = setup();

      const error = { message: 'Outside map' };

      validateWaypointData.mockReturnValue(Ok({}));
      validateWaypointsInsideMap.mockReturnValue(() => Error(error));

      const result = await service.createNewWaypoint({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(error);
    });

  });

  describe('createMultipleWaypoints', () => {

    it('Should return Ok when all waypoints are valid', async () => {
      const { service, mockWaypointRepository } = setup();

      const map = { id: '1' };
      const waypoints = [
        { name: 'W1', x: 1, y: 1 },
        { name: 'W2', x: 2, y: 2 }
      ];

      const created = waypoints.map((w, i) => ({
        id: `${i + 1}`,
        ...w
      }));

      checkEach.mockImplementation(() => () => Ok(waypoints));

      validateWaypointsInsideMap.mockReturnValue(() => Ok(waypoints));
      mockWaypointRepository.createMultipleWaypoints
        .mockResolvedValue(created);

      const result = await service.createMultipleWaypoints(map, waypoints);

      expect(checkEach).toHaveBeenCalled();
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(mockWaypointRepository.createMultipleWaypoints)
        .toHaveBeenCalledWith(waypoints);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(created);
    });

    it('Should return Error when one waypoint is invalid', async () => {
      const { service } = setup();
      const error = { message: 'Invalid waypoint' };

      checkEach.mockImplementation(() => () => Error(error));

      const result = await service.createMultipleWaypoints({}, [{}, {}]);

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(error);
    });

  });

  describe('fetchAllWaypoints', () => {

    it('Should return Ok with all waypoints', async () => {
      const { service, mockWaypointRepository } = setup();

      const waypoints = [{ id: '1' }, { id: '2' }];

      mockWaypointRepository.getAllWaypoints
        .mockResolvedValue(waypoints);

      const result = await service.fetchAllWaypoints();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(waypoints);
    });

  });

  describe('fetchWaypointById', () => {

    it('Should return Ok when waypoint exists', async () => {
      const { service, mockWaypointRepository } = setup();

      const waypoint = { id: '1' };

      mockWaypointRepository.getWaypointById
        .mockResolvedValue(waypoint);

      const result = await service.fetchWaypointById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(waypoint);
    });

    it('Should return Error when waypoint does not exist', async () => {
      const { service, mockWaypointRepository } = setup();

      mockWaypointRepository.getWaypointById
        .mockResolvedValue(null);

      const result = await service.fetchWaypointById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Waypoint not found');
    });

  });

  describe('modifyWaypointById', () => {

    it('Should return Ok when waypoint is updated', async () => {
      const { service, mockWaypointRepository } = setup();

      const updated = { id: '1', name: 'Updated name' };

      mockWaypointRepository.updateWaypointById
        .mockResolvedValue(updated);

      const result = await service.modifyWaypointById('1', { name: 'Updated name' });

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updated);
    });

    it('Should return Error when waypoint to update not found', async () => {
      const { service, mockWaypointRepository } = setup();

      mockWaypointRepository.updateWaypointById
        .mockResolvedValue(null);

      const result = await service.modifyWaypointById('1', {});

      expect(result.isError).toBe(true);
      expect(result.value.message)
        .toBe('Waypoint to update not found');
    });

  });

  describe('removeWaypointById', () => {

    it('Should return Ok when waypoint is deleted', async () => {
      const { service, mockWaypointRepository } = setup();

      mockWaypointRepository.deleteWaypointById
        .mockResolvedValue(true);

      const result = await service.removeWaypointById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('Should return Error when waypoint to remove not found', async () => {
      const { service, mockWaypointRepository } = setup();

      mockWaypointRepository.deleteWaypointById
        .mockResolvedValue(null);

      const result = await service.removeWaypointById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message)
        .toBe('Waypoint to remove not found');
    });
  });
});
