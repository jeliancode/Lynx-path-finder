import * as obstacleService from '../../application/services/obstacleService.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createObstacle = async (req, res, next) => {
    try {
        const { x, y, width, height } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const newObstacle = await obstacleService.createNewObstacle(map, { x, y, width, height, mapId });

        createdSuccessfully(res)('Obstacle created successfully')(newObstacle);
    } catch (error) {
        next(error);  
    }
};

export const createMultipleObstacles = async (req, res, next) => {
    try {
        const obstaclesData = req.body;
        const map = req.map;
        const { mapId } = req.params;
        const obstaclesWithMapId = obstaclesData.map(obstacle =>({
            ...obstacle,
            mapId
        }));
        const newObstacles = await obstacleService.createMultipleObstacles(map, obstaclesWithMapId);

        createdSuccessfully(res)('Obstacles created successfully')(newObstacles);
    } catch (error) {
        next(error);  
    }
};

export const getAllObstacles = async (req, res, next) => {
    try {
        const obstacles = await obstacleService.fetchAllObstacles();

        completedSuccessfully(res)('All obstacles get successfully')(obstacles);
    } catch (error) {
        next(error);  
    }
};

export const getObstacleById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const obstacle = await obstacleService.fetchObstacleById(id);

        completedSuccessfully(res)('Obstacle get successfully')(obstacle);
    } catch (error) {
        next(error);
    }
};

export const updateObstacle = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updatedObstacle = await obstacleService.modifyObstacleById(id, req.body);
        
        completedSuccessfully(res)('Obstacle updated successfully')(updatedObstacle);
    } catch (error) {
        next(error); 
    }
};

export const deleteObstacle = async (req, res, next) => {
    try {
        const {id} = req.params;
        await obstacleService.removeObstacleById(id);

        deletedSuccessfully(res)('Obstacle deleted successfully')();
    } catch (error) {
        next(error);
    }
};
