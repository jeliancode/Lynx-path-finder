import express from 'express';
import * as mapController from '../controllers/mapController.js';

const router = express.Router({ mergeParams: true });
router
    .post('/', mapController.createMap)
    .get('/', mapController.getAllMaps)
    .get('/:id', mapController.getMapById)
    .put('/:id', mapController.updateMap)
    .delete('/:id', mapController.deleteMap);

export default router;
    