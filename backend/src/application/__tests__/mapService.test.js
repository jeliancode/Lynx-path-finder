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
import { Ok, Error } from '../../utils/funtional/monad.js'

describe('Map Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return Ok with created map', async () => {
    const mapData = { name: 'Mapa 1', width: 30, height: 30, userId: 'user1' };
    const createdMap = { id: '1', ...mapData };

    validateMapData.mockReturnValue(Ok(mapData));
    mapRepository.createMap.mockResolvedValue(createdMap);

    const result = await createNewMap(mapData);

    expect(validateMapData).toHaveBeenCalledWith(mapData);
    expect(mapRepository.createMap).toHaveBeenCalledWith(mapData);

    expect(result.isOk).toBe(true);
    expect(result.value).toEqual(createdMap);
  });


  describe('fetchAllMaps', () => {
    it('Should return Ok with all maps', async () => {
      const maps = [{ id: '1' }];

      mapRepository.getAllMaps.mockResolvedValue(maps);

      const result = await fetchAllMaps();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(maps);
    });
  });

  describe('fetchMapById', () => {
    it('Should return Ok when map exists', async () => {
      const map = { id: '1' };

      mapRepository.getMapById.mockResolvedValue(map);

      const result = await fetchMapById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(map);
    });

    it('returns Error when map does not exist', async () => {
      mapRepository.getMapById.mockResolvedValue(null);

      const result = await fetchMapById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map not found');
    });
  });

  describe('modifyMapById', () => {
    it('returns Ok when map is updated', async () => {
      const updated = { id: '1', name: 'Nuevo' };

      mapRepository.updateMapById.mockResolvedValue(updated);

      const result = await modifyMapById('1', { name: 'Nuevo' });

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updated);
    });

    it('returns Error when map to update does not exist', async () => {
      mapRepository.updateMapById.mockResolvedValue(null);

      const result = await modifyMapById('1', {});

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map to update not found');
    });
  });

  describe('removeMapById', () => {
    it('returns Ok when map is deleted', async () => {
      mapRepository.deleteMapById.mockResolvedValue(true);

      const result = await removeMapById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('returns Error when map to delete does not exist', async () => {
      mapRepository.deleteMapById.mockResolvedValue(null);

      const result = await removeMapById('1');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('Map to delete not found');
    });

  });
});
