import * as mapRepository from '../repositories/mapRepository.js';

const validateMapData = (data) => {
    if (!data.name || data.width <= 0 || data.height <= 0) {
        throw new Error('Datos de mapa inválidos: El nombre es requerido y las dimensiones deben ser mayores a 0');
    }
    return data;
};

export const createNewMap = async (mapData) => {
    const validatedData = validateMapData(mapData);
    return await mapRepository.createMap(validatedData);
};

export const fetchAllMaps = async () => {
    return await mapRepository.getAllMaps();
};

export const fetchMapById = async (id) => {
    const map = await mapRepository.getMapById(id);
    if (!map) throw new Error('Mapa no encontrado');
    return map;
};

export const modifyMapById = async (id, updateData) => {
    const validatedData = validateMapData(updateData);
    return await mapRepository.updateMapById(id, validatedData);
};

export const removeMapById = async (id) => {
    return await mapRepository.deleteMapById(id);
};
