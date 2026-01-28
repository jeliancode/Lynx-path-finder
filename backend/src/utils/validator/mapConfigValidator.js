import validateWith  from './validator.js';
import pipe from '../funtional/pipe.js';

const hasObstacles = (map) =>
  Array.isArray(map.obstacles) && map.obstacles.length > 0;

const hasWaypoints = (map) =>
  Array.isArray(map.waypoints) && map.waypoints.length > 0;


export const validateMapConfiguration = pipe(
  validateWith(hasObstacles, () => new Error("El mapa debe contener obstáculos")),
  validateWith(hasWaypoints, () => new Error("El mapa debe contener puntos de parada")),
);
