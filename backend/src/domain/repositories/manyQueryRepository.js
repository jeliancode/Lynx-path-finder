import prisma from '../../infrastructure/prisma.js';

export const createManyRecords = (entity, data) => 
  prisma[entity].createMany({ data });

export const findManyRecords = (entity, query = {}) => 
  prisma[entity].findMany(query);
