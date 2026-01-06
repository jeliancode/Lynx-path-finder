import prisma from '../prisma.js';

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const updateUserById = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};
