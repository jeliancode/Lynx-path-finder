import * as obstacleService from '../../application/services/obstacleService.js';

export const createObstacle = async (req, res) => {
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
        res.status(400).json({
            success: false,
            message: error.message
        });    }
};

export const createMultipleObstacles = async (req, res) => {
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
            message: 'Obstacle deleted successfully'
        });    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });    }
};
