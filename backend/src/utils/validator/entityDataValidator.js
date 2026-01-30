import validateWith from './validator.js';
import pipe from '../funtional/pipe.js';
import { unprocessableEntity } from '../error/httpError.js';

const hasValidName = (entityData) =>
    entityData.name != null || entityData.username != null;

const hasValidEmail = (entityData) =>
    typeof entityData.email === 'string' && entityData.email.includes('@');

const hasValidPassword = (entityData) =>
    typeof entityData.password === 'string' && entityData.password.length >= 8;

const hasValidDimensions = (entityData) =>
  entityData.width > 0 && entityData.height > 0;

const hasValidUserId = (entityData) =>
    entityData.userId != null;

export const validateMapData = pipe(
    validateWith(hasValidName, () => unprocessableEntity('Map must have a valid name')),
    validateWith(hasValidDimensions, () => unprocessableEntity('Map must have valid dimensions')),
    validateWith(hasValidUserId, () => unprocessableEntity('Map must have a valid user id assigned'))
);

export const validateUserData = pipe(
    validateWith(hasValidName, () => unprocessableEntity('User must have a valid username')),
    validateWith(hasValidEmail, () => unprocessableEntity('User must have a valid email address')),
    validateWith(hasValidPassword, () => unprocessableEntity('User must have a valid password of at least 8 characters'))
);

export const validateObstacleData = pipe(
    validateWith(hasValidDimensions, () => unprocessableEntity('Obstacle must have valid dimensions'))
)

export const validateWaypointData = pipe(
    validateWith(hasValidName, () => unprocessableEntity('Waypoint must have a valid name')),
);
