import checkEach from '../../domain/validator/listValidator.js'
import { validateObstacleInsideMap } from '../../domain/validator/insideMapValidator.js';
import validateObstacleData from '../../domain/validator/obstacleDataValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import pipe from '../../domain/shared/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const obstacleService = ({ obstacleRepository }) => ({

  createNewObstacle: (map, obstacleData) => 
    pipe(
      validateObstacleData,
      validateObstacleInsideMap(map),
      (data) => fromPromise(() => obstacleRepository.createObstacle(data))
    )(obstacleData),

  createMultipleObstacles: (map, obstaclesData) =>
    pipe(
      checkEach(validateObstacleData),
      validateObstacleInsideMap(map),
      (data) => fromPromise(() => obstacleRepository.createMultipleObstacles(data))
    )(obstaclesData),

  fetchAllObstacles: () => 
    fromPromise(() => obstacleRepository.getAllObstacles()),

  fetchObstacleById: (id) =>
    fromPromise(() => obstacleRepository.getObstacleById(id))
      .then(result => ResultMonad.chain(ensureFound('Obstacle not found'))(result)),

  modifyObstacleById: (id, updateData) =>
    fromPromise(() => obstacleRepository.updateObstacleById(id, updateData))
      .then(result => ResultMonad.chain(ensureFound('Obstacle to update not found'))(result)),

  removeObstacleById: (id) =>
    fromPromise(() => obstacleRepository.deleteObstacleById(id))
      .then(result => ResultMonad.chain(ensureFound('Obstacle to delete not found'))(result)),
});