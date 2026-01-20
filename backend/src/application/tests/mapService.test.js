import { jest } from '@jest/globals';

jest.unstable_mockModule(
  '../../infrastructure/repositories/mapRepository.js',
  () => ({
    createMap: jest.fn(),
    getAllMaps: jest.fn(),
    getMapById: jest.fn(),
    updateMapById: jest.fn(),
    deleteMapById: jest.fn()
  })
);

const mapRepository = await import('../../infrastructure/repositories/mapRepository.js');
const {
  createNewMap,
  fetchAllMaps,
  fetchMapById,
  modifyMapById,
  removeMapById
} = await import('../services/mapService.js');

describe('Map Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewMap', () => {
    it('debería crear un mapa con datos válidos', async () => {
      const mapData = { name: 'Mapa 1', width: 10, height: 10 };
      const createdMap = { id: '1', ...mapData };

      mapRepository.createMap.mockResolvedValue(createdMap);

      const result = await createNewMap(mapData);

      expect(mapRepository.createMap).toHaveBeenCalledWith(mapData);
      expect(result).toEqual(createdMap);
    });

    it('debería lanzar error si los datos son inválidos', async () => {
      const invalidData = { name: '', width: 0, height: 10 };

      await expect(createNewMap(invalidData))
        .rejects
        .toThrow('Datos de mapa inválidos');
    });
  });

  describe('fetchAllMaps', () => {
    it('debería devolver todos los mapas', async () => {
      const maps = [{ id: '1', name: 'Mapa A' }];

      mapRepository.getAllMaps.mockResolvedValue(maps);

      const result = await fetchAllMaps();

      expect(mapRepository.getAllMaps).toHaveBeenCalled();
      expect(result).toEqual(maps);
    });
  });

  describe('fetchMapById', () => {
    it('debería devolver un mapa si existe', async () => {
      const map = { id: '1', name: 'Mapa X' };

      mapRepository.getMapById.mockResolvedValue(map);

      const result = await fetchMapById('1');

      expect(mapRepository.getMapById).toHaveBeenCalledWith('1');
      expect(result).toEqual(map);
    });

    it('debería lanzar error si el mapa no existe', async () => {
      mapRepository.getMapById.mockResolvedValue(null);

      await expect(fetchMapById('999'))
        .rejects
        .toThrow('Mapa no encontrado');
    });
  });

  describe('modifyMapById', () => {
    it('debería actualizar un mapa con datos válidos', async () => {
      const updateData = { name: 'Nuevo', width: 5, height: 5 };
      const updatedMap = { id: '1', ...updateData };

      mapRepository.updateMapById.mockResolvedValue(updatedMap);

      const result = await modifyMapById('1', updateData);

      expect(mapRepository.updateMapById)
        .toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedMap);
    });
  });

  describe('removeMapById', () => {
    it('debería eliminar un mapa', async () => {
      mapRepository.deleteMapById.mockResolvedValue(true);

      const result = await removeMapById('1');

      expect(mapRepository.deleteMapById)
        .toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
