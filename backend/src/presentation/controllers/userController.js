import * as userService from '../../application/services/userService.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await userService.createNewUser({ username, email, password });
        
        createdSuccessfully(res)('User created successfully')(newUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.fetchAllUsers();

        completedSuccessfully(res)('All users get successfully')(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try{
        const {id} = req.params;
        const user = await userService.fetchUserById(id);

        completedSuccessfully(res)("User get successfully")(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const updatedUser = await userService.modifyUserById(id, updateData);

        completedSuccessfully(res)('User updated successfully')(updatedUser);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        await userService.removeUserById(id);

        deletedSuccessfully(res)('User deleted successfully');
    } catch (error) {
        next(error);
    }
};
