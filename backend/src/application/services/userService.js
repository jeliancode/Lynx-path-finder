import validateUserData from '../../domain/validator/userDataValidator.js';
import { notFoundError } from '../../domain/shared/error/httpError.js';
import { Ok, Error, fromPromise, ResultMonad } from '../../domain/shared/funtional/monad.js';
import pipe from '../../domain/shared/funtional/pipe.js';

const ensureFound = (errorMsg) => (data) => 
  data ? Ok(data) : Error(notFoundError(errorMsg));

export const userService = ({ userRepository }) => ({
  
  createNewUser: (userData) =>
    pipe(
      validateUserData,
      (validData) => fromPromise(() => userRepository.createUser(validData))
    )(userData),

  fetchUserById: (id) =>
    fromPromise(() => userRepository.getUserById(id))
      .then(result => ResultMonad.chain(ensureFound('User not found'))(result)),

  fetchAllUsers: () =>
    fromPromise(() => userRepository.getAllUsers()),

  modifyUserById: (id, updateData) =>
    fromPromise(() => userRepository.updateUserById(id, updateData))
      .then(result => ResultMonad.chain(ensureFound('User to update not found'))(result)),

  removeUserById: (id) =>
    fromPromise(() => userRepository.deleteUserById(id))
      .then(result => ResultMonad.chain(ensureFound('User to delete not found'))(result)),

  fetchUserByUsername: (username) =>
    fromPromise(() => userRepository.getUserByUsername(username))
      .then(result => ResultMonad.chain(ensureFound('User not found by username'))(result)),
});