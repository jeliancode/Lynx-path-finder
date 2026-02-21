import prisma from '../../infrastructure/prisma.js';

export const createManyRecords = (entity, data) => 
  prisma[entity].createMany({ data });

export const findManyRecords = (entity, include = {}) => 
  prisma[entity].findMany({ include });
