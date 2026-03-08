import { mapService } from '../services/mapService.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/validator/mapDataValidator.js');
import validateMapData from '../../domain/validator/mapDataValidator.js';

describe('Map Service - Full Suite', () => {
  
  const setup = () => {
    const mockMapRepository = {
      createMap: jest.fn(),
      getAllMaps: jest.fn(),
      getMapById: jest.fn(),
      updateMapById: jest.fn(),
      deleteMapById: jest.fn()
    };
    const service = mapService({ mapRepository: mockMapRepository });
    return { service, mockMapRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewMap', () => {
    it('Should return Ok with created map when data is valid', async () => {
      const { service, mockMapRepository } = setup();
      const mapData = { name: 'Test Map', width: 10, height: 10 };
      
      validateMapData.mockReturnValue(Ok(mapData));
      mockMapRepository.createMap.mockResolvedValue({ id: 'map-123', ...mapData });

      const result = await service.createNewMap(mapData);

      expect(result.isOk).toBe(true);
      expect(result.value.id).toBe('map-123');
    });

    it('Should return Error (Negative) when validation fails', async () => {
      const { service, mockMapRepository } = setup();
      const invalidData = { name: '' };
      const validationError = { status: 422, message: 'Invalid map data' };

      validateMapData.mockReturnValue(Error(validationError));

      const result = await service.createNewMap(invalidData);

      expect(result.isError).toBe(true);
      expect(result.value).toEqual(validationError);
      expect(mockMapRepository.createMap).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllMaps', () => {
    it('Should return Ok with empty array (Edge Case) when no maps exist', async () => {
      const { service, mockMapRepository } = setup();
      mockMapRepository.getAllMaps.mockResolvedValue([]);

      const result = await service.fetchAllMaps();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual([]);
    });
  });

  describe('fetchMapById', () => {
    it('Should return Error (Negative) when ID is not found', async () => {
      const { service, mockMapRepository } = setup();
      mockMapRepository.getMapById.mockResolvedValue(null);

      const result = await service.fetchMapById('non-existent');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map not found');
      expect(result.value.status).toBe(404);
    });
  });

  describe('modifyMapById', () => {
    it('Should return Ok when update is successful', async () => {
      const { service, mockMapRepository } = setup();
      const updateData = { name: 'Updated Name' };
      mockMapRepository.updateMapById.mockResolvedValue({ id: '1', ...updateData });

      const result = await service.modifyMapById('1', updateData);

      expect(result.isOk).toBe(true);
      expect(result.value.name).toBe('Updated Name');
    });

    it('Should return Error (Negative) when trying to update a non-existent map', async () => {
      const { service, mockMapRepository } = setup();
      mockMapRepository.updateMapById.mockResolvedValue(null);

      const result = await service.modifyMapById('999', { name: 'New' });

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map to update not found');
    });
  });

  describe('removeMapById', () => {
    it('Should return Error (Negative) when trying to delete a non-existent map', async () => {
      const { service, mockMapRepository } = setup();
      mockMapRepository.deleteMapById.mockResolvedValue(null);

      const result = await service.removeMapById('invalid-id');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map to delete not found');
    });

    it('Should return Ok (Edge Case) even if ID is unusual (e.g., extremely long)', async () => {
      const { service, mockMapRepository } = setup();
      const longId = 'a'.repeat(500);
      mockMapRepository.deleteMapById.mockResolvedValue({ id: longId });

      const result = await service.removeMapById(longId);

      expect(result.isOk).toBe(true);
      expect(mockMapRepository.deleteMapById).toHaveBeenCalledWith(longId);
    });
  });
});
