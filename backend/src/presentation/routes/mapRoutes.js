import express from 'express';
import { container } from '../../infrastructure/container.js';
import { mapController } from '../controllers/mapController.js';

const router = express.Router({ mergeParams: true });
const controller = mapController(container.mapService);

router
    .post('/', controller.createMap)
    .get('/', controller.getAllMaps)
    .get('/:id', controller.getMapById)
    .put('/:id', controller.updateMap)
    .delete('/:id', controller.deleteMap);

export default router;
    