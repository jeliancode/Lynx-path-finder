import validateMapData from '../../domain/validator/mapDataValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import pipe from '../../domain/shared/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const mapService = ({ mapRepository }) => ({
  createNewMap: (mapData) =>
    pipe(
      validateMapData,
      (validData) => fromPromise(() => mapRepository.createMap(validData))
    )(mapData),

  fetchMapById: (id) =>
    fromPromise(() => mapRepository.getMapById(id))
      .then(result => ResultMonad.chain(ensureFound('Map not found'))(result)),

  fetchAllMaps: () => 
    fromPromise(() => mapRepository.getAllMaps()),

  modifyMapById: (id, data) =>
    fromPromise(() => mapRepository.updateMapById(id, data))
      .then(result => ResultMonad.chain(ensureFound('Map to update not found'))(result)),

  removeMapById: (id) =>
    fromPromise(() => mapRepository.deleteMapById(id))
      .then(result => ResultMonad.chain(ensureFound('Map to delete not found'))(result)),
  
});