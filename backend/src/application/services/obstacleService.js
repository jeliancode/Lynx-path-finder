import * as obstacleRepository from '../../infrastructure/repositories/obstacleRepository.js';

const validateObstacleData = (data) => {
    if (data.size <= 0) {
        throw new Error('Datos de obstáculo inválidos: El tamaño debe ser mayor a 0');
    }
    return data;
};

export const createObstacle = async (obstacleData) => {
    const validatedData = validateObstacleData(obstacleData);
    return await obstacleRepository.createObstacle(validatedData);
};

export const createMultipleObstacles = async (obstaclesData) => {
    const validatedData = obstaclesData.map(data => validateObstacleData(data));
    return await obstacleRepository.createMultipleObstacles(validatedData);
};

export const fetchAllObstacles = async () => {
    return await obstacleRepository.getAllObstacles();
};

export const fetchObstacleById = async (id) => {
    const obstacle = await obstacleRepository.getObstacleById(id);
    if (!obstacle) throw new Error('Obstáculo no encontrado');
    return obstacle;
};

export const modifyObstacleById = async (id, updateData) => {
    const validatedData = validateObstacleData(updateData);
    return await obstacleRepository.updateObstacleById(id, validatedData);
};

export const removeObstacleById = async (id) => {
    return await obstacleRepository.deleteObstacleById(id);
};
