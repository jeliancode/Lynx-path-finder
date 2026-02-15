import express from 'express';
import { routeController } from '../controllers/routeController.js';
import { container } from '../../infrastructure/container.js';

const router = express.Router({ mergeParams: true });
const controller = routeController(container.routeService);

router
    .post('/', controller.createRoute)
    .get('/validate/:id', controller.validateRouteWaypoints)
    .get('/', controller.getAllRoutes)
    .get('/:id', controller.getRouteById)
    .put('/:id', controller.updateRoute)
    .delete('/:id', controller.deleteRoute);
    
export default router;
