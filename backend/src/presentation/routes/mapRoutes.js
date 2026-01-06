import express from 'express';
import * as mapController from '../controllers/mapsController.js';

const router = express.Router();

router
    .post('/', mapController.createMap)
    .get('/', mapController.getAllMaps)
    .get('/:id', mapController.getMapById)
    .put('/:id', mapController.updateMap)
    .delete('/:id', mapController.deleteMap);

export default router;
    