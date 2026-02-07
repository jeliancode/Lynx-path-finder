jest.mock(
  '../../infrastructure/repositories/mapRepository.js',
  () => ({
    createMap: jest.fn(),
    getAllMaps: jest.fn(),
    getMapById: jest.fn(),
    updateMapById: jest.fn(),
    deleteMapById: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/entityDataValidator.js',
  () => ({
    validateMapData: jest.fn()
  })
);

import {
  createNewMap,
  fetchAllMaps,
  fetchMapById,
  modifyMapById,
  removeMapById
} from '../services/mapService.js';

import * as mapRepository from '../../infrastructure/repositories/mapRepository.js';
import { validateMapData } from '../../utils/validator/entityDataValidator.js';

describe('Map Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewMap', () => {
    it('Should validate data and create a new map', async () => {
      const mapData = { name: 'Mapa 1', width: 10, height: 10, userId: '1' };
      const createdMap = { id: '1', ...mapData };

      validateMapData.mockReturnValue(undefined);
      mapRepository.createMap.mockResolvedValue(createdMap);

      const result = await createNewMap(mapData);

      expect(validateMapData).toHaveBeenCalledWith(mapData);
      expect(mapRepository.createMap).toHaveBeenCalledWith(mapData);
      expect(result).toEqual(createdMap);
    });

    it('Should throw error if validator throws', async () => {
      const invalidData = { name: '', width: 0 };

      validateMapData.mockImplementation(() => {
        throw new Error('Invalid map data');
      });

      await expect(createNewMap(invalidData))
        .rejects
        .toThrow('Invalid map data');

      expect(mapRepository.createMap).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllMaps', () => {
    it('Should return all maps', async () => {
      const maps = [{ id: '1', name: 'Mapa A' }];

      mapRepository.getAllMaps.mockResolvedValue(maps);

      const result = await fetchAllMaps();

      expect(mapRepository.getAllMaps).toHaveBeenCalled();
      expect(result).toEqual(maps);
    });
  });

  describe('fetchMapById', () => {
    it('Should return map if exists', async () => {
      const map = { id: '1', name: 'Mapa X' };

      mapRepository.getMapById.mockResolvedValue(map);

      const result = await fetchMapById('1');

      expect(mapRepository.getMapById).toHaveBeenCalledWith('1');
      expect(result).toEqual(map);
    });

    it('Should throw error if map does not exist', async () => {
      mapRepository.getMapById.mockResolvedValue(null);

      await expect(fetchMapById('999'))
        .rejects
        .toThrow('Map not found');
    });
  });

  describe('modifyMapById', () => {
    it('Should update map', async () => {
      const updateData = { name: 'Nuevo' };
      const updatedMap = { id: '1', ...updateData };

      mapRepository.updateMapById.mockResolvedValue(updatedMap);

      const result = await modifyMapById('1', updateData);

      expect(mapRepository.updateMapById)
        .toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedMap);
    });
  });

  describe('removeMapById', () => {
    it('Should delete map', async () => {
      mapRepository.deleteMapById.mockResolvedValue(true);

      const result = await removeMapById('1');

      expect(mapRepository.deleteMapById)
        .toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
