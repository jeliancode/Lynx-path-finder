import * as userService from '../../application/services/userService.js';

export const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await userService.createNewUser({ username, email, password });
        
        res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try{
        const {id} = req.params;
        const user = await userService.fetchUserById(id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const updatedUser = await userService.modifyUserById(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        await userService.removeUserById(id);

        res.status(200).json({
            success: true,
            message: 'User deleted sucessfully'
        });
    } catch (error) {
        next(error);
    }
};
