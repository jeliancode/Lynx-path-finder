import * as userRepository from '../repositories/userRepository.js';

const validateUserData = (data) => {
    if (!data.username || !data.email) {
        throw new Error('Datos de usuario inválidos: El nombre de usuario y el correo electrónico son requeridos');
    }
    return data;
};

export const createNewUser = async (userData) => {
    const validatedData = validateUserData(userData);
    return await userRepository.createUser(validatedData);
};

export const fetchAllUsers = async () => {
    return await userRepository.getAllUsers();
};

export const fetchUserById = async (id) => {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
};

export const modifyUserById = async (id, updateData) => {
    const validatedData = validateUserData(updateData);
    return await userRepository.updateUserById(id, validatedData);
};

export const removeUserById = async (id) => {
    return await userRepository.deleteUserById(id);
};  
