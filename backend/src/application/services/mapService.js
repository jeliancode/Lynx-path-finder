import * as mapRepository from '../../infrastructure/repositories/mapRepository.js';
import { validateMapData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../utils/funtional/monad.js';
import pipe from '../../utils/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const createNewMap = (mapData) =>
  pipe(
    validateMapData,
    (validData) => fromPromise(() => mapRepository.createMap(validData))
  )(mapData);

export const fetchMapById = (id) =>
  fromPromise(() => mapRepository.getMapById(id))
    .then(result => ResultMonad.chain(ensureFound('Map not found'))(result));

export const fetchAllMaps = () => 
  fromPromise(() => mapRepository.getAllMaps());

export const modifyMapById = (id, data) =>
  fromPromise(() => mapRepository.updateMapById(id, data))
    .then(result => ResultMonad.chain(ensureFound('Map to update not found'))(result));

export const removeMapById = (id) =>
  fromPromise(() => mapRepository.deleteMapById(id))
    .then(result => ResultMonad.chain(ensureFound('Map to delete not found'))(result));