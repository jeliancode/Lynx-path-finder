import { mapController } from '../controllers/mapController.js';
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

describe('Map Controller - Clean Tests', () => {
  
  const setup = () => {
    const mockMapService = {
      createNewMap: jest.fn(),
      fetchAllMaps: jest.fn(),
      fetchMapById: jest.fn(),
      modifyMapById: jest.fn(),
      removeMapById: jest.fn()
    };

    const controller = mapController(mockMapService);
    
    const mockRes = {};
    const mockNext = jest.fn();

    const mockSuccessResponse = () => {
      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      return { messageFn, responseFn };
    };

    return { controller, mockMapService, mockRes, mockNext, mockSuccessResponse };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMap', () => {
    it('Should call service and return success response on valid data', async () => {
      const { controller, mockMapService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const req = { body: { name: 'New Map', width: 10, height: 10, userId: 'u1' } };
      const createdMap = { id: 'm1', ...req.body };

      mockMapService.createNewMap.mockResolvedValue(Ok(createdMap));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createMap(req, mockRes, mockNext);

      expect(mockMapService.createNewMap).toHaveBeenCalledWith(req.body);
      expect(createdSuccessfully).toHaveBeenCalledWith(mockRes);
      expect(messageFn).toHaveBeenCalledWith('Map created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdMap);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should call next with error when service returns Error monad', async () => {
      const { controller, mockMapService, mockRes, mockNext } = setup();
      const serviceError = { status: 422, message: 'Invalid data' };

      mockMapService.createNewMap.mockResolvedValue(Error(serviceError));

      await controller.createMap({ body: {} }, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('getMapById', () => {
    it('Should return map and status 200 when found', async () => {
      const { controller, mockMapService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      const map = { id: '1', name: 'Map 1' };

      mockMapService.fetchMapById.mockResolvedValue(Ok(map));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.getMapById({ params: { id: '1' } }, mockRes, mockNext);

      expect(mockMapService.fetchMapById).toHaveBeenCalledWith('1');
      expect(responseFn).toHaveBeenCalledWith(map);
    });
  });

  describe('deleteMap', () => {
    it('Should return deleted status when successfully removed', async () => {
      const { controller, mockMapService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();

      mockMapService.removeMapById.mockResolvedValue(Ok(true));
      deletedSuccessfully.mockReturnValue(messageFn);

      await controller.deleteMap({ params: { id: '1' } }, mockRes, mockNext);

      expect(mockMapService.removeMapById).toHaveBeenCalledWith('1');
      expect(deletedSuccessfully).toHaveBeenCalledWith(mockRes);
      expect(responseFn).toHaveBeenCalled();
    });
  });
});