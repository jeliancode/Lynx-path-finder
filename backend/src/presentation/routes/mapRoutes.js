import express from 'express';
import { container } from '../../infrastructure/container.js';
import { mapController } from '../controllers/mapController.js';
import { validateUUID } from '../../middlewares/validateUUID.js';

const router = express.Router({ mergeParams: true });
const controller = mapController(container.mapService);

router
    .post('/',controller.createMap)
    .get('/', controller.getAllMaps)
    .get('/:id', validateUUID(), controller.getMapById)
    .put('/:id', validateUUID(), controller.updateMap)
    .delete('/:id', validateUUID(), controller.deleteMap);

export default router;
    