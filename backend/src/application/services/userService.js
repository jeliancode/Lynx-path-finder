import * as userRepository from '../../infrastructure/repositories/userRepository.js';
import { validateUserData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';

export const createNewUser = async (userData) => {
    validateUserData(userData);
    return await userRepository.createUser(userData);
};

export const fetchAllUsers = async () => {
    return await userRepository.getAllUsers();
};

export const fetchUserById = async (id) => {
    const user = await userRepository.getUserById(id);
    if (!user) notFoundError('User not found');
    return user;
};

export const modifyUserById = async (id, updateData) => {
    return await userRepository.updateUserById(id, updateData);
};

export const removeUserById = async (id) => {
    return await userRepository.deleteUserById(id);
};  
