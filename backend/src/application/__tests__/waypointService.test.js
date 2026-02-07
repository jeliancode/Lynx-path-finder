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

describe('Waypoint Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewWaypoint', () => {

    it('Should create a waypoint with valid data', async () => {
      const map = { id: '1', width: 10, height: 10 };
      const waypointData = { name: 'Waypoint test', x: 3, y: 3 };
      const createdWaypoint = { id: '1', ...waypointData };

      validateWaypointData.mockImplementation(() => {});
      validateWaypointsInsideMap.mockReturnValue(jest.fn());

      waypointRepository.createWaypoint.mockResolvedValue(createdWaypoint);

      const result = await createNewWaypoint(map, waypointData);

      expect(validateWaypointData).toHaveBeenCalledWith(waypointData);
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(waypointRepository.createWaypoint)
        .toHaveBeenCalledWith(waypointData);
      expect(result).toEqual(createdWaypoint);
    });

    it('Should throw error if waypoint data is invalid', async () => {
      validateWaypointData.mockImplementation(() => {
        throw new Error('Invalid waypoint data');
      });

      const map = { id: '1', width: 10, height: 10 };
      const waypointData = { name: '', x: 3, y: 50 };

      await expect(createNewWaypoint(map, waypointData))
        .rejects
        .toThrow('Invalid waypoint data');

      expect(waypointRepository.createWaypoint).not.toHaveBeenCalled();
    });
  });

  describe('createMultipleWaypoints', () => {

    it('Should create multiple waypoints with valid data', async () => {
      const map = { id: '1', width: 10, height: 10 };
      const waypointsData = [
        { name: 'W1', x: 1, y: 1 },
        { name: 'W2', x: 2, y: 2 },
        { name: 'W3', x: 5, y: 5 }
      ];

      const createdWaypoints = waypointsData.map((w, i) => ({
        id: `${i + 1}`,
        ...w
      }));

      validateWaypointData.mockImplementation(() => {});
      validateWaypointsInsideMap.mockReturnValue(jest.fn());

      waypointRepository.createMultipleWaypoints
        .mockResolvedValue(createdWaypoints);

      const result = await createMultipleWaypoints(map, waypointsData);

      expect(validateWaypointData).toHaveBeenCalledTimes(waypointsData.length);
      expect(validateWaypointsInsideMap).toHaveBeenCalledWith(map);
      expect(waypointRepository.createMultipleWaypoints)
        .toHaveBeenCalledWith(waypointsData);
      expect(result).toEqual(createdWaypoints);
    });
  });

  describe('fetchAllWaypoints', () => {

    it('Should return all waypoints', async () => {
      const waypoints = [{ id: '1' }, { id: '2' }];

      waypointRepository.getAllWaypoints.mockResolvedValue(waypoints);

      const result = await fetchAllWaypoints();

      expect(waypointRepository.getAllWaypoints).toHaveBeenCalled();
      expect(result).toEqual(waypoints);
    });
  });

  describe('fetchWaypointById', () => {

    it('Should return waypoint if exists', async () => {
      const waypoint = { id: '1' };

      waypointRepository.getWaypointById.mockResolvedValue(waypoint);

      const result = await fetchWaypointById('1');

      expect(waypointRepository.getWaypointById)
        .toHaveBeenCalledWith('1');
      expect(result).toEqual(waypoint);
    });

    it('Should throw error if waypoint does not exist', async () => {
      waypointRepository.getWaypointById.mockResolvedValue(null);

      await expect(fetchWaypointById('999'))
        .rejects
        .toThrow('Waypoint not found');
    });
  });

  describe('modifyWaypointById', () => {

    it('Should update waypoint', async () => {
      const updateData = { name: 'Updated name' };
      const updatedWaypoint = { id: '1', ...updateData };

      waypointRepository.updateWaypointById
        .mockResolvedValue(updatedWaypoint);

      const result = await modifyWaypointById('1', updateData);

      expect(waypointRepository.updateWaypointById)
        .toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedWaypoint);
    });
  });

  describe('removeWaypointById', () => {

    it('Should delete waypoint', async () => {
      waypointRepository.deleteWaypointById.mockResolvedValue(true);

      const result = await removeWaypointById('1');

      expect(waypointRepository.deleteWaypointById)
        .toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
