import * as userService from '../../application/services/userService.js';

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await userService.createNewUser({ username, email, password });
        
        res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await userService.fetchUserById(id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const updatedUser = await userService.modifyUserById(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        await userService.removeUserById(id);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
