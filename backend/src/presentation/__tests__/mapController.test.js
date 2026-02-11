jest.mock('../../application/services/mapService.js', () => ({
  createNewMap: jest.fn(),
  fetchAllMaps: jest.fn(),
  fetchMapById: jest.fn(),
  modifyMapById: jest.fn(),
  removeMapById: jest.fn()
}));

jest.mock('../../utils/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createMap,
  getAllMaps,
  getMapById,
  updateMap,
  deleteMap
} from '../controllers/mapController.js';
import * as mapService from '../../application/services/mapService.js';
import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../utils/error/httpSuccess.js';
import { Ok, Error } from '../../utils/funtional/monad.js';


const mockRes = () => ({});
const mockNext = jest.fn();

describe('Map controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMap', () => {
    it('Should create a map and return 201 response', async () => {
      const req = {
        body: { name: 'Mapa 1', width: 10, height: 10, userId: '1' }
      };
      const res = mockRes();

      const createdMap = { id: '1', ...req.body };

      mapService.createNewMap.mockResolvedValue(Ok(createdMap));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createMap(req, res, mockNext);

      expect(mapService.createNewMap).toHaveBeenCalledWith(req.body);
      expect(createdSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('Map created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdMap);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should throw error if service fails', async () => {
      const error = new Error('Error');
      const req = { body: {} };
      const res = mockRes();

      mapService.createNewMap.mockResolvedValue(Error(error));

      await createMap(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllMaps', () => {
    it('Should return all maps', async () => {
      const req = {};
      const res = mockRes();
      const maps = [{ id: '1' }, { id: '2' }];

      mapService.fetchAllMaps.mockResolvedValue(Ok(maps));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getAllMaps(req, res, mockNext);

      expect(mapService.fetchAllMaps).toHaveBeenCalled();
      expect(completedSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('All maps get successfully');
      expect(responseFn).toHaveBeenCalledWith(maps);
    });
  });

  describe('getMapById', () => {
    it('Should return map by id', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();
      const map = { id: '1' };

      mapService.fetchMapById.mockResolvedValue(Ok(map));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getMapById(req, res, mockNext);

      expect(mapService.fetchMapById).toHaveBeenCalledWith('1');
      expect(responseFn).toHaveBeenCalledWith(map);
    });
  });

  describe('updateMap', () => {
    it('Should update map successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Updated' }
      };
      const res = mockRes();
      const updatedMap = { id: '1', ...req.body };

      mapService.modifyMapById.mockResolvedValue(Ok(updatedMap));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await updateMap(req, res, mockNext);

      expect(mapService.modifyMapById).toHaveBeenCalledWith('1', req.body);
      expect(responseFn).toHaveBeenCalledWith(updatedMap);
    });
  });

  describe('deleteMap', () => {
    it('Should delete map successfully', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      mapService.removeMapById.mockResolvedValue(Ok(true));

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      deletedSuccessfully.mockReturnValue(messageFn);

      await deleteMap(req, res, mockNext);

      expect(mapService.removeMapById).toHaveBeenCalledWith('1');
      expect(deletedSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('Map deleted successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });
});
