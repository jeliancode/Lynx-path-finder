import express from 'express';
import * as routeController from '../controllers/routeController.js';

const router = express.Router();

router
    .post('/', routeController.createRoute)
    .get('/', routeController.getAllRoutes)
    .get('/:id', routeController.getRouteById)
    .put('/:id', routeController.updateRoute)
    .delete('/:id', routeController.deleteRoute);
    
export default router;
