import express from 'express';
import { routeController } from '../controllers/routeController.js';
import { container } from '../../infrastructure/container.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = routeController(container.routeService);

router
    .post('/', validateUUID('mapId'), controller.createRoute)
    .get('/validate/:id', validateUUID('mapId'), validateUUID('id'), controller.validateRoute)
    .get('/', validateUUID('mapId'), controller.getAllRoutes)
    .get('/:id', validateUUID('mapId'), validateUUID('id'), controller.getRouteById)
    .put('/:id', validateUUID('mapId'), validateUUID('id'), controller.updateRoute)
    .delete('/:id', validateUUID('mapId'), validateUUID('id'), controller.deleteRoute);
    
export default router;
