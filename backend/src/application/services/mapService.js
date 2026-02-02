import * as mapRepository from '../../infrastructure/repositories/mapRepository.js';
import { validateMapData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js'

export const createNewMap = async (mapData) => {
    validateMapData(mapData);
    return await mapRepository.createMap(mapData);
};

export const fetchAllMaps = async () => {
    return await mapRepository.getAllMaps();
};

export const fetchMapById = async (id) => {
    const map = await mapRepository.getMapById(id);
    if (!map) throw notFoundError('Map not found');
    return map;
};

export const modifyMapById = async (id, updateData) => {
    return await mapRepository.updateMapById(id, updateData);
};

export const removeMapById = async (id) => {
    return await mapRepository.deleteMapById(id);
};
