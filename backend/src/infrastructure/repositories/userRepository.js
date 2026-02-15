import { 
  createRecord,  
  findUniqueRecord, 
  updateRecord, 
  deleteRecord 
} from './baseRepository.js';
import { findManyRecords } from '../../domain/repositories/manyQueryRepository.js';
import prisma from '../prisma.js';

const entity = 'user';

const mapUserData = (data) => ({
  username: data.username,
  email: data.email,
  password: data.password,
});

export const createUser = async (userData) => 
  await createRecord(entity, mapUserData(userData));

export const getAllUsers = async () => 
  await findManyRecords(entity);

export const getUserById = async (id) => 
  await findUniqueRecord(entity, id);

export const updateUserById = async (id, updateData) => 
  await updateRecord(entity, id, updateData);

export const deleteUserById = async (id) => 
  await deleteRecord(entity, id);

export const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username }
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};