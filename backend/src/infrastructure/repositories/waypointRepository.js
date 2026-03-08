import { 
  createRecord, 
  findUniqueRecord, 
  updateRecord, 
  deleteRecord 
} from '../../domain/repositories//baseRepository.js';
import { findManyRecords, createManyRecords } from '../../domain/repositories/manyQueryRepository.js';

const entity = 'waypoint';

const mapWaypointData = (data) => ({
  name: data.name,
  x: data.x,
  y: data.y,
  mapId: data.mapId,
});

export const createWaypoint = async (waypointData) => 
  await createRecord(entity, mapWaypointData(waypointData));

export const createMultipleWaypoints = async (waypointsData) => 
  await createManyRecords(entity, waypointsData.map(mapWaypointData));

export const getAllWaypoints = async () => 
  await findManyRecords(entity);

export const getWaypointById = async (id) => 
  await findUniqueRecord(entity, id);

export const findByIds = async (ids) =>
  await findManyRecords(entity, {
    where: {
      id: { in: ids }
    }
  });

export const updateWaypointById = async (id, updateData) => 
  await updateRecord(entity, id, updateData);

export const deleteWaypointById = async (id) => 
  await deleteRecord(entity, id);