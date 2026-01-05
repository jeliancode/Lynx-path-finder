import express from 'express';
import userRoutes from './routes/userRoutes.js';
import waypointRoutes from './routes/waypointRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import obstacleRoutes from './routes/obstacleRoutes.js';

const app = express();

app.use(express.json());
app
    .use('/api/users', userRoutes)
    .use('/api/waypoints', waypointRoutes)
    .use('/api/routes', routeRoutes)
    .use('/api/maps', mapRoutes)
    .use('/api/obstacles', obstacleRoutes);

export default app;
