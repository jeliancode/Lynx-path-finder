import * as obstacleRepository from '../../infrastructure/repositories/obstacleRepository.js';
import { validateObstacleInsideMap } from '../../utils/validator/insideMapValidator.js';
import { validateObstacleData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';

export const createNewObstacle = async (map, obstacleData) => {
    validateObstacleData(obstacleData);
    validateObstacleInsideMap(map)(obstacleData);
    return await obstacleRepository.createObstacle(obstacleData);
};

export const createMultipleObstacles = async (map, obstaclesData) => {
    obstaclesData.map(data => validateObstacleData(data));
    validateObstacleInsideMap(map)(obstaclesData);
    return await obstacleRepository.createMultipleObstacles(obstaclesData);
};

export const fetchAllObstacles = async () => {
    return await obstacleRepository.getAllObstacles();
};

export const fetchObstacleById = async (id) => {
    const obstacle = await obstacleRepository.getObstacleById(id);
    if (!obstacle) throw notFoundError('Obstacle not found');
    return obstacle;
};

export const modifyObstacleById = async (id, updateData) => {
    return await obstacleRepository.updateObstacleById(id, updateData);
};

export const removeObstacleById = async (id) => {
    return await obstacleRepository.deleteObstacleById(id);
};
