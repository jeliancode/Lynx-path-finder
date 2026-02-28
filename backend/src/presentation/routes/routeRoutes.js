import express from 'express';
import { routeController } from '../controllers/routeController.js';
import { container } from '../../infrastructure/container.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = routeController(container.routeService);

router
    .post('/', validateUUID('mapId'), controller.createRoute)
    .post('/possible', validateUUID('mapId'), controller.getPossibleRoute)
    .get('/validate/:id', validateUUID('mapId'), validateUUID('id'), controller.validateRouteWaypoints)
    .get('/', validateUUID('mapId'), controller.getAllRoutes)
    .get('/:id', validateUUID('mapId'), validateUUID('id'), controller.getRouteById)
    .put('/:id', validateUUID('mapId'), validateUUID('id'), controller.updateRoute)
    .delete('/:id', validateUUID('mapId'), validateUUID('id'), controller.deleteRoute)
    .post('/analyze/:id', validateUUID('mapId'), validateUUID('id'), controller.analyzeRoutePerformance);
    
export default router;
