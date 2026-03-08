import express from 'express';
import { container } from '../../infrastructure/container.js';
import { userController } from '../controllers/userController.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = userController(container.userService);

router
    .post('/', controller.createUser)
    .get('/', controller.getAllUsers)
    .get('/:id', validateUUID(), controller.getUserById)
    .put('/:id', validateUUID(), controller.updateUser)
    .delete('/:id', validateUUID(), controller.deleteUser);

export default router;
