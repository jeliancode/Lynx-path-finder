import { ResultMonad } from '../../utils/funtional/monad.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const obstacleController = (obstacleService) => ({
    createObstacle: async (req, res, next) => {
        const { x, y, width, height } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const creationResult = await obstacleService.createNewObstacle(map, { x, y, width, height, mapId });

        ResultMonad.fold(
            (error) => next(error),
            (newObstacle) => createdSuccessfully(res)('Obstacle created successfully')(newObstacle)
        )(creationResult);
    },

    createMultipleObstacles: async (req, res, next) => {
        const obstaclesData = req.body;
        const map = req.map;
        const { mapId } = req.params;
        const obstaclesWithMapId = obstaclesData.map(obstacle =>({
            ...obstacle,
            mapId
        }));
        const creationResult = await obstacleService.createMultipleObstacles(map, obstaclesWithMapId);

        ResultMonad.fold(
            (error) => next(error),
            (newObstacles) => createdSuccessfully(res)('Obstacles created successfully')(newObstacles)
        )(creationResult);
    },

    getAllObstacles: async (req, res, next) => {
        const getResults = await obstacleService.fetchAllObstacles();

        ResultMonad.fold(
            (error) => next(error),
            (obstacles) => completedSuccessfully(res)('All obstacles get successfully')(obstacles)
        )(getResults);
    },

    getObstacleById: async (req, res, next) => {
        const {id} = req.params;
        const getResults = await obstacleService.fetchObstacleById(id);

        ResultMonad.fold(
            (error) => next(error),
            (obstacle) => completedSuccessfully(res)('Obstacle get successfully')(obstacle)
        )(getResults);
    },

    updateObstacle: async (req, res, next) => {
        const {id} = req.params;
        const updateResults = await obstacleService.modifyObstacleById(id, req.body);
            
        ResultMonad.fold(
            (error) => next(error),
            (updatedObstacle) => completedSuccessfully(res)('Obstacle updated successfully')(updatedObstacle)
        )(updateResults);

    },

    deleteObstacle: async (req, res, next) => {
        const {id} = req.params;
        const deleteResult = await obstacleService.removeObstacleById(id);

        ResultMonad.fold(
            (error) => next(error),
            () => deletedSuccessfully(res)('Obstacle deleted successfully')()
        )(deleteResult);
    },
})