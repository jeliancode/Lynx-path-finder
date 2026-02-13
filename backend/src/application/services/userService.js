import * as userRepository from '../../infrastructure/repositories/userRepository.js';
import { validateUserData } from '../../utils/validator/entityDataValidator.js';
import { notFoundError } from '../../utils/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../utils/funtional/monad.js';
import pipe from '../../utils/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const createNewUser = (userData) =>
  pipe(
    validateUserData,
    (validData) => fromPromise(() => userRepository.createUser(validData))
  )(userData);

export const fetchUserById = (id) =>
  fromPromise(() => userRepository.getUserById(id))
    .then(result => ResultMonad.chain(ensureFound('User not found'))(result));

export const fetchAllUsers = () =>
  fromPromise(() => userRepository.getAllUsers());

export const modifyUserById = (id, updateData) =>
  fromPromise(() => userRepository.updateUserById(id, updateData))
    .then(result => ResultMonad.chain(ensureFound('User to update not found'))(result));

export const removeUserById = (id) =>
  fromPromise(() => userRepository.deleteUserById(id))
    .then(result => ResultMonad.chain(ensureFound('User to delete not found'))(result));