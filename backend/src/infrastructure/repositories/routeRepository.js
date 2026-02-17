import { 
  createRecord, 
  findManyRecords, 
  findUniqueRecord, 
  updateRecord, 
  deleteRecord 
} from './baseRepository.js';

const entity = 'route';

const mapRouteData = (data) => ({
  mapId: data.mapId,
  startX: data.startX,
  startY: data.startY,
  endX: data.endX,
  endY: data.endY,
  distance: data.distance,
  path: data.path,
});

export const createRoute = async (routeData) => 
  await createRecord(entity, mapRouteData(routeData));

export const getAllRoutes = async () => 
  await findManyRecords(entity);

export const getRouteById = async (id) => 
  await findUniqueRecord(entity, id);

export const updateRouteById = async (id, updateData) => 
  await updateRecord(entity, id, updateData);

export const deleteRouteById = async (id) => 
  await deleteRecord(entity, id);