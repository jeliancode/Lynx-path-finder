import validateWith  from './validator.js';
import pipe from '../funtional/pipe.js';

const hasValidDimensions = (map) =>
  map.width > 0 && map.height > 0;

const hasObstacles = (map) =>
  Array.isArray(map.obstacles) && map.obstacles.length > 0;

const hasWaypoints = (map) =>
  Array.isArray(map.waypoints) && map.waypoints.length > 0;


export const validateMapConfiguration = pipe(
  validateWith(hasValidDimensions, () => new Error("Dimensiones del mapa inválidas")),
  validateWith(hasObstacles, () => new Error("El mapa debe contener obstáculos")),
  validateWith(hasWaypoints, () => new Error("El mapa debe contener puntos de parada")),
);
