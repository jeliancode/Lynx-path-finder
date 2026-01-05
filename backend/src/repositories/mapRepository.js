import prisma from "../config/prisma.js";

export const createMap = async (mapData) => {
  return await prisma.map.create({
    data: {
      name: mapData.name,
      width: mapData.width,
      height: mapData.height,
      userId: mapData.userId,
    },
    include: {
      obstacles: true,
    }
  });
};

export const getAllMaps = async () => {
  return await prisma.map.findMany({
    include: { obstacles: true, waypoints: true }
  });
};

export const getMapById = async (id) => {
  return await prisma.map.findUnique({
    where: { id },
    include: { obstacles: true, waypoints: true }
  });
};

export const updateMapById = async (id, updateData) => {
  return await prisma.map.update({
    where: { id },
    data: updateData,
    include: { obstacles: true, waypoints: true }
  });
};

export const deleteMapById = async (id) => {
  return await prisma.map.delete({
    where: { id },
  });
};
