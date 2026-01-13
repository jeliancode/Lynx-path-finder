import express from 'express';
import * as routeController from '../controllers/routeController.js';
import validateMapExists from '../../middlewares/validateMapExists.js';
import validateMapConfiguration from '../../middlewares/validateMapConfig.js';
import validateStartEndPoints from '../../middlewares/validateStartEndPoints.js';

const router = express.Router();

router
    .post('/', validateMapExists, 
        validateMapConfiguration, 
        validateStartEndPoints, 
        routeController.createRoute)
    .get('/validate/:id', routeController.validateRouteWaypoints)
    .get('/', routeController.getAllRoutes)
    .get('/:id', routeController.getRouteById)
    .put('/:id', routeController.updateRoute)
    .delete('/:id', routeController.deleteRoute);
    
export default router;
