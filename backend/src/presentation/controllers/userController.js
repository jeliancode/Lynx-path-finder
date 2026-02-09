import * as userService from '../../application/services/userService.js';
import { ResultMonad } from '../../utils/funtional/monad.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const creationResult = await userService.createNewUser({ username, email, password });
    
    ResultMonad.fold(
        (error) => next(error),
        (newUser) => createdSuccessfully(res)('User created successfully')(newUser)
    )(creationResult);
};

export const getAllUsers = async (req, res, next) => {
    const getResult = await userService.fetchAllUsers();

    ResultMonad.fold(
        (error) => next(error),
        (users) => completedSuccessfully(res)('All users get successfully')(users)
    )(getResult);
};

export const getUserById = async (req, res, next) => {
    const {id} = req.params;
    const getResult = await userService.fetchUserById(id);

    ResultMonad.fold(
        (error) => next(error),
        (user) => completedSuccessfully(res)("User get successfully")(user)
    )(getResult);
};

export const updateUser = async (req, res, next) => {
    const {id} = req.params;
    const updateData = req.body;
    const updateResult = await userService.modifyUserById(id, updateData);

    ResultMonad.fold(
        (error) => next(error),
        (updatedUser) => completedSuccessfully(res)('User updated successfully')(updatedUser)
    )(updateResult);
    
}

export const deleteUser = async (req, res, next) => {
    const {id} = req.params;
    const deleteResult = await userService.removeUserById(id);

    ResultMonad.fold(
        (error) => next(error),
        () => deletedSuccessfully(res)('User deleted successfully')()
    )(deleteResult);
};
