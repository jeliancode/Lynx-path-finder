import prisma from '../prisma.js';

export const createWaypoint = async (waypointData) => {
  return await prisma.waypoint.create({
    data: {
        name: waypointData.name,
        x: waypointData.x,
        y: waypointData.y,
        mapId: waypointData.mapId,
    },
  });
};

export const getAllWaypoints = async () => {
  return await prisma.waypoint.findMany();
};

export const getWaypointById = async (id) => {
  return await prisma.waypoint.findUnique({
    where: { id },
  });
};

export const updateWaypointById = async (id, updateData) => {
  return await prisma.waypoint.update({
    where: { id },
    data: updateData,
  });
};

export const deleteWaypointById = async (id) => {
  return await prisma.waypoint.delete({
    where: { id },
  });
};
