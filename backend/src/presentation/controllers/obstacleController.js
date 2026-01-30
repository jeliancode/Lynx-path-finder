import * as obstacleService from '../../application/services/obstacleService.js';

export const createObstacle = async (req, res, next) => {
    try {
        const { x, y, width, height } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const newObstacle = await obstacleService.createObstacle(map, { x, y, width, height, mapId });

        res.status(201).json({
            success: true,
            data: newObstacle
        });
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
        }))
        const newObstacles = await obstacleService.createMultipleObstacles(map, obstaclesWithMapId);

        res.status(201).json({
            success: true,
            data: newObstacles
        });
    } catch (error) {
        next(error);  
    }
};

export const getAllObstacles = async (req, res, next) => {
    try {
        const obstacles = await obstacleService.fetchAllObstacles();

        res.status(200).json({
            success: true,
            data: obstacles
        });
    } catch (error) {
        next(error);  
    }
};

export const getObstacleById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const obstacle = await obstacleService.fetchObstacleById(id);

        res.status(200).json({
            success: true,
            data: obstacle
        });
    } catch (error) {
        next(error);
    }
};

export const updateObstacle = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updatedObstacle = await obstacleService.modifyObstacleById(id, req.body);
        
        res.status(200).json({
            success: true,
            data: updatedObstacle
        });
    } catch (error) {
        next(error); 
    }
};

export const deleteObstacle = async (req, res, next) => {
    try {
        const {id} = req.params;
        await obstacleService.removeObstacleById(id);
        res.status(200).json({
            success: true,
            message: 'Obstacle deleted successfully'
        });    } catch (error) {
        next(error);
    }
};
