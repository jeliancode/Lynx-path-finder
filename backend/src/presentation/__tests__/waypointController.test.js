jest.mock('../../application/services/waypointService.js', () => ({
  createNewWaypoint: jest.fn(),
  createMultipleWaypoints: jest.fn(),
  fetchAllWaypoints: jest.fn(),
  fetchWaypointById: jest.fn(),
  modifyWaypointById: jest.fn(),
  removeWaypointById: jest.fn()
}));

jest.mock('../../utils/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createWaypoint,
  createMultipleWaypoints,
  getAllWaypoints,
  getWaypointById,
  updateWaypoint,
  deleteWaypoint
} from '../controllers/waypointController.js';

import * as waypointService from '../../application/services/waypointService.js';
import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../utils/error/httpSuccess.js';
import { Ok, Error } from '../../utils/funtional/monad.js';

const mockRes = () => ({});
const mockNext = jest.fn();

describe('Waypoint Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWaypoint', () => {
    it('Should create waypoint successfully', async () => {
      const req = {
        body: { name: 'WP 1', x: 2, y: 3 },
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      const createdWaypoint = { id: '1', ...req.body, mapId: 'map-1' };

      waypointService.createNewWaypoint.mockResolvedValue(Ok(createdWaypoint));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createWaypoint(req, res, mockNext);

      expect(waypointService.createNewWaypoint)
        .toHaveBeenCalledWith(req.map, { ...req.body, mapId: 'map-1' });
      expect(createdSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('Waypoint created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdWaypoint);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should call next(error) if service fails', async () => {
      const error = new Error('Error');
      const req = { body: {}, params: {}, map: {} };
      const res = mockRes();

      waypointService.createNewWaypoint.mockResolvedValue(Error(error));

      await createWaypoint(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createMultipleWaypoints', () => {
    it('Should create multiple waypoints successfully', async () => {
      const req = {
        body: [
          { name: 'WP 1', x: 1, y: 1 },
          { name: 'WP 2', x: 2, y: 2 }
        ],
        params: { mapId: 'map-1' },
        map: { id: 'map-1' }
      };
      const res = mockRes();

      const waypointsWithMapId = req.body.map(wp => ({
        ...wp,
        mapId: 'map-1'
      }));

      waypointService.createMultipleWaypoints.mockResolvedValue(Ok(waypointsWithMapId));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createMultipleWaypoints(req, res, mockNext);

      expect(waypointService.createMultipleWaypoints).toHaveBeenCalledWith(req.map, waypointsWithMapId);
      expect(messageFn).toHaveBeenCalledWith('Waypoints created successfully');
      expect(responseFn).toHaveBeenCalledWith(waypointsWithMapId);
    });
  });

  describe('getAllWaypoints', () => {
    it('Should return all waypoints', async () => {
      const req = {};
      const res = mockRes();
      const waypoints = [{ id: '1' }, { id: '2' }];

      waypointService.fetchAllWaypoints.mockResolvedValue(Ok(waypoints));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getAllWaypoints(req, res, mockNext);

      expect(waypointService.fetchAllWaypoints).toHaveBeenCalled();
      expect(messageFn).toHaveBeenCalledWith('All waypoints get successfully');
      expect(responseFn).toHaveBeenCalledWith(waypoints);
    });
  });

  describe('getWaypointById', () => {
    it('Should return waypoint by id', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();
      const waypoint = { id: '1', name: 'WP' };

      waypointService.fetchWaypointById.mockResolvedValue(Ok(waypoint));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getWaypointById(req, res, mockNext);

      expect(waypointService.fetchWaypointById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Waypoint get successfully');
      expect(responseFn).toHaveBeenCalledWith(waypoint);
    });
  });

  describe('updateWaypoint', () => {
    it('Should update waypoint successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Updated WP' }
      };
      const res = mockRes();
      const updatedWaypoint = { id: '1', ...req.body };

      waypointService.modifyWaypointById.mockResolvedValue(Ok(updatedWaypoint));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await updateWaypoint(req, res, mockNext);

      expect(waypointService.modifyWaypointById).toHaveBeenCalledWith('1', req.body);
      expect(messageFn).toHaveBeenCalledWith('Waypoint updated successfully');
      expect(responseFn).toHaveBeenCalledWith(updatedWaypoint);
    });
  });

  describe('deleteWaypoint', () => {
    it('Should delete waypoint successfully', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      waypointService.removeWaypointById.mockResolvedValue(Ok(true));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      deletedSuccessfully.mockReturnValue(messageFn);

      await deleteWaypoint(req, res, mockNext);

      expect(waypointService.removeWaypointById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('Waypoint deleted successfully');
    });
  });
});
