import prisma from '../prisma.js';

export const createRecord = (entity, data, include = {}) => 
  prisma[entity].create({ data, include });

export const findUniqueRecord = (entity, id, include = {}) => 
  prisma[entity].findUnique({ where: { id }, include });

export const updateRecord = (entity, id, data, include = {}) => 
  prisma[entity].update({ where: { id }, data, include });

export const deleteRecord = (entity, id) => 
  prisma[entity].delete({ where: { id } });
