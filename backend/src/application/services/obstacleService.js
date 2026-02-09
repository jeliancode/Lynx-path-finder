import * as obstacleRepository from '../../infrastructure/repositories/obstacleRepository.js';
import { validateObstacleInsideMap } from '../../utils/validator/insideMapValidator.js';
import { validateObstacleData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../utils/funtional/monad.js';
import pipe from '../../utils/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const createNewObstacle = (map, obstacleData) => 
  pipe(
    validateObstacleData,
    validateObstacleInsideMap(map),
    (data) => fromPromise(() =>
      obstacleRepository.createObstacle(data)
    )
  )(obstacleData);

export const createMultipleObstacles = (map, obstaclesData) =>
  pipe(
    (data) => Ok(data.map(validateObstacleData)), 
    validateObstacleInsideMap(map),
    (data) => fromPromise(() => 
      obstacleRepository.createMultipleObstacles(data)
    )
  )(obstaclesData);

export const fetchAllObstacles = () => 
  fromPromise(() => obstacleRepository.getAllObstacles());

export const fetchObstacleById = (id) =>
  fromPromise(() => obstacleRepository.getObstacleById(id))
    .then(result => ResultMonad.chain(ensureFound('Obstacle not found'))(result));

export const modifyObstacleById = (id, updateData) =>
  fromPromise(() => obstacleRepository.updateObstacleById(id, updateData))
    .then(result => ResultMonad.chain(ensureFound('Obstacle to update not found'))(result));

export const removeObstacleById = (id) =>
  fromPromise(() => obstacleRepository.deleteObstacleById(id));