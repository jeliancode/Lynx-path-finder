import express from 'express';
import userRoutes from './presentation/routes/userRoutes.js';
import waypointRoutes from './presentation/routes/waypointRoutes.js';
import routeRoutes from './presentation/routes/routeRoutes.js';
import mapRoutes from './presentation/routes/mapRoutes.js';
import obstacleRoutes from './presentation/routes/obstacleRoutes.js';

const app = express();

app.use(express.json());
app
    .use('/api/users', userRoutes)
    .use('/api/waypoints', waypointRoutes)
    .use('/api/routes', routeRoutes)
    .use('/api/maps', mapRoutes)
    .use('/api/obstacles', obstacleRoutes);

export default app;
