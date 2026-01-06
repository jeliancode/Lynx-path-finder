import prisma from '../prisma.js';

export const createRoute = async (routeData) => {
  return await prisma.route.create({
    data: {
        mapId: routeData.mapId,
        startX: routeData.startX,
        startY: routeData.startY,
        endX: routeData.endX,
        endY: routeData.endY,
        distance: routeData.distance,
        path: routeData.path,
    },
  });
};

export const getAllRoutes = async () => {
  return await prisma.route.findMany();
};

export const getRouteById = async (id) => {
  return await prisma.route.findUnique({
    where: { id },
  });
};

export const updateRouteById = async (id, updateData) => {
  return await prisma.route.update({
    where: { id },
    data: updateData,
  });
};

export const deleteRouteById = async (id) => {
  return await prisma.route.delete({
    where: { id },
  });
};
