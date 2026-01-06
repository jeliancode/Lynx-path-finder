import prisma from '../prisma.js';

export const createObstacle = async (obstacleData) => {
  return await prisma.obstacle.create({
    data: {
        x: obstacleData.x,
        y: obstacleData.y,
        size: obstacleData.size,
        mapId: obstacleData.mapId,
    },
  });
};

export const createMultipleObstacles = async (obstaclesData) => {
  return await prisma.obstacle.createMany({
    data: obstaclesData.map(obstacle => ({
        x: obstacle.x,
        y: obstacle.y,
        size: obstacle.size,
        mapId: obstacle.mapId,
    })),
  });
};

export const getAllObstacles = async () => {
  return await prisma.obstacle.findMany();
};

export const getObstacleById = async (id) => {
  return await prisma.obstacle.findUnique({
    where: { id },
  });
};

export const updateObstacleById = async (id, updateData) => {
  return await prisma.obstacle.update({
    where: { id },
    data: updateData,
  });
};

export const deleteObstacleById = async (id) => {
  return await prisma.obstacle.delete({
    where: { id },
  });
};
