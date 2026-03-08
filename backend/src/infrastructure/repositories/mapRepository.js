import { 
  createRecord, 
  findUniqueRecord, 
  updateRecord, 
  deleteRecord } from '../../domain/repositories/baseRepository.js';
import { findManyRecords } from '../../domain/repositories/manyQueryRepository.js';


const entity = 'map';
const defaultInclude = { obstacles: true, waypoints: true };

export const createMap = async (mapData) => {
  const data = {
    name: mapData.name,
    width: mapData.width,
    height: mapData.height,
    userId: mapData.userId,
  };
  return await createRecord(entity, data, { obstacles: true });
};

export const getAllMaps = async () => 
  await findManyRecords(entity, defaultInclude);

export const getMapById = async (id) => 
  await findUniqueRecord(entity, id, defaultInclude);

export const updateMapById = async (id, updateData) => 
  await updateRecord(entity, id, updateData, defaultInclude);

export const deleteMapById = async (id) => 
  await deleteRecord(entity, id);