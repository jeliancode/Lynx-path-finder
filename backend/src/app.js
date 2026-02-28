import express from 'express';
import userRoutes from './presentation/routes/userRoutes.js';
import waypointRoutes from './presentation/routes/waypointRoutes.js';
import routeRoutes from './presentation/routes/routeRoutes.js';
import mapRoutes from './presentation/routes/mapRoutes.js';
import obstacleRoutes from './presentation/routes/obstacleRoutes.js';
import { validateMapExists } from './middlewares/validateMapExists.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { createMemoizationMiddleware } from './middlewares/memoizationMiddleware.js';
import { cacheConfig } from './config/cacheConfig.js';

const app = express();

app.use(express.json());
app.use(createMemoizationMiddleware(cacheConfig));
app
    .use('/api/users', userRoutes)
    .use('/api/maps', mapRoutes)
    .use('/api/waypoints/:mapId', validateMapExists(), waypointRoutes)
    .use('/api/routes/:mapId', validateMapExists(), routeRoutes)
    .use('/api/obstacles/:mapId', validateMapExists(), obstacleRoutes);

app.use(errorHandler);

export default app;
