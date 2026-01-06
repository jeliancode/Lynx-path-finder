import express from 'express';
import * as userController  from '../controllers/userController.js';

const router = express.Router();

router
    .post('/', userController.createUser)
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getUserById)
    .put('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser);

export default router;
