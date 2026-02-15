import { 
  createRecord, 
  createManyRecords, 
  findUniqueRecord, 
  updateRecord, 
  deleteRecord 
} from './baseRepository.js';
import { createManyRecords, findManyRecords } from '../../domain/repositories/manyQueryRepository.js';

const entity = 'obstacle';

const mapObstacleData = (data) => ({
  x: data.x,
  y: data.y,
  width: data.width,
  height: data.height,
  mapId: data.mapId,
});

export const createObstacle = async (obstacleData) => 
  await createRecord(entity, mapObstacleData(obstacleData));

export const createMultipleObstacles = async (obstaclesData) => 
  await createManyRecords(entity, obstaclesData.map(mapObstacleData));

export const getAllObstacles = async () => 
  await findManyRecords(entity);

export const getObstacleById = async (id) => 
  await findUniqueRecord(entity, id);

export const updateObstacleById = async (id, updateData) => 
  await updateRecord(entity, id, updateData);

export const deleteObstacleById = async (id) => 
  await deleteRecord(entity, id);