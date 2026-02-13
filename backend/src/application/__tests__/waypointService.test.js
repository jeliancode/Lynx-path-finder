jest.mock(
  '../../infrastructure/repositories/waypointRepository.js',
  () => ({
    createWaypoint: jest.fn(),
    createMultipleWaypoints: jest.fn(),
    getAllWaypoints: jest.fn(),
    getWaypointById: jest.fn(),
    updateWaypointById: jest.fn(),
    deleteWaypointById: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/entityDataValidator.js',
  () => ({
    validateWaypointData: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/insideMapValidator.js',
  () => ({
    validateWaypointsInsideMap: jest.fn()
  })
);

import {
  createNewWaypoint,
  createMultipleWaypoints,
  fetchAllWaypoints,
  fetchWaypointById,
  modifyWaypointById,
  removeWaypointById
} from '../services/waypointService.js';

import * as waypointRepository from '../../infrastructure/repositories/waypointRepository.js';
import { validateWaypointData } from '../../utils/validator/entityDataValidator.js';
import { validateWaypointsInsideMap } from '../../utils/validator/insideMapValidator.js';
import { Ok, Error } from '../../utils/funtional/monad.js';

describe('Waypoint Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewWaypoint', () => {
    it('Should return Ok with created waypoint', async () => {
      const map = { id: '1', width: 10, height: 10 };
      const waypointData = { name: 'Waypoint test', x: 3, y: 3 };
      const createdWaypoint = { id: '1', ...waypointData };

      validateWaypointData.mockReturnValue(Ok(waypointData));
      validateWaypointsInsideMap.mockReturnValue(() => Ok(waypointData));
      waypointRepository.createWaypoint.mockResolvedValue(createdWaypoint);

      const result = await createNewWaypoint(map, waypointData);

      expect(validateWaypointData).toHaveBeenCalledWith(waypointData);
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(waypointRepository.createWaypoint)
        .toHaveBeenCalledWith(waypointData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdWaypoint);
    });

    it('returns Error when waypoint data is invalid', async () => {
      const error = new Error('Invalid waypoint data');

      validateWaypointData.mockReturnValue(Error(error));

      const result = await createNewWaypoint({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
      expect(waypointRepository.createWaypoint).not.toHaveBeenCalled();
    });

    it('Should return Error when waypoint is outside map', async () => {
      const error = new Error('Outside map');

      validateWaypointData.mockReturnValue(Ok({}));
      validateWaypointsInsideMap.mockReturnValue(() => Error(error));

      const result = await createNewWaypoint({}, {});

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('createMultipleWaypoints', () => {
    it('Should return Ok when all waypoints are valid', async () => {
      const map = { id: '1', width: 10, height: 10 };
      const waypoints = [
        { name: 'W1', x: 1, y: 1 },
        { name: 'W2', x: 2, y: 2 },
        { name: 'W3', x: 5, y: 5 }
      ];

      const created = waypoints.map((w, i) => ({
        id: `${i + 1}`,
        ...w
      }));

      validateWaypointData.mockImplementation(w => Ok(w));
      validateWaypointsInsideMap.mockReturnValue(() => Ok(waypoints));
      waypointRepository.createMultipleWaypoints.mockResolvedValue(created);

      const result = await createMultipleWaypoints(map, waypoints);

      expect(validateWaypointData).toHaveBeenCalledTimes(waypoints.length);
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(waypointRepository.createMultipleWaypoints)
        .toHaveBeenCalledWith(waypoints);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(created);
    });

    it('Should return Error when one waypoint is invalid', async () => {
      const error = new Error('Invalid waypoint');

      validateWaypointData
        .mockReturnValueOnce(Ok({}))
        .mockReturnValueOnce(Error(error));

      const result = await createMultipleWaypoints({}, [{}, {}]);

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('fetchAllWaypoints', () => {
    it('Should return Ok with all waypoints', async () => {
      const waypoints = [{ id: '1' }, { id: '2' }];

      waypointRepository.getAllWaypoints.mockResolvedValue(waypoints);

      const result = await fetchAllWaypoints();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(waypoints);
    });
  });

  describe('fetchWaypointById', () => {
    it('Should return Ok when waypoint exists', async () => {
      const waypoint = { id: '1' };

      waypointRepository.getWaypointById.mockResolvedValue(waypoint);

      const result = await fetchWaypointById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(waypoint);
    });

    it('Should return Error when waypoint does not exist', async () => {
      waypointRepository.getWaypointById.mockResolvedValue(null);

      const result = await fetchWaypointById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Waypoint not found');
    });
  });

  describe('modifyWaypointById', () => {
    it('Should return Ok when waypoint is updated', async () => {
      const updated = { id: '1', name: 'Updated name' };

      waypointRepository.updateWaypointById.mockResolvedValue(updated);

      const result = await modifyWaypointById('1', { name: 'Updated name' });

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updated);
    });
  });

  describe('removeWaypointById', () => {
    it('Should return Ok with delete result', async () => {
      waypointRepository.deleteWaypointById.mockResolvedValue(true);

      const result = await removeWaypointById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });
  });
});
