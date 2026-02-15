import express from 'express';
import { container } from '../../infrastructure/container.js';
import { userController } from '../controllers/userController.js';

const router = express.Router({ mergeParams: true });
const controller = userController(container.userService);

router
    .post('/', controller.createUser)
    .get('/', controller.getAllUsers)
    .get('/:id', controller.getUserById)
    .put('/:id', controller.updateUser)
    .delete('/:id', controller.deleteUser);

export default router;
