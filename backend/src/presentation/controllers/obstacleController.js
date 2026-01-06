import * as obstacleService from '../../application/services/obstacleService.js';

export const createObstacle = async (req, res) => {
    try {
        const {x, y, size, mapId} = req.body;
        const newObstacle = await obstacleService.createObstacle({ x, y, size, mapId });
        res.status(201).json({
            success: true,
            data: newObstacle
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });    }
};

export const createMultipleObstacles = async (req, res) => {
    try {
        const obstaclesData = req.body;
        const newObstacles = await obstacleService.createMultipleObstacles(obstaclesData);
        res.status(201).json({
            success: true,
            data: newObstacles
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });    }
};

export const getAllObstacles = async (req, res) => {
    try {
        const obstacles = await obstacleService.fetchAllObstacles();
        res.status(200).json({
            success: true,
            data: obstacles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });    }
};

export const getObstacleById = async (req, res) => {
    try {
        const {id} = req.params;
        const obstacle = await obstacleService.fetchObstacleById(id);

        res.status(200).json({
            success: true,
            data: obstacle
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });    }
};

export const updateObstacle = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedObstacle = await obstacleService.modifyObstacleById(id, req.body);
        
        res.status(200).json({
            success: true,
            data: updatedObstacle
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });    
    }
};

export const deleteObstacle = async (req, res) => {
    try {
        const {id} = req.params;
        await obstacleService.removeObstacleById(id);
        res.status(200).json({
            success: true,
            message: 'Obstaculo eliminado exitosamente'
        });    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });    }
};
