import validateWith from './validator.js';
import pipe from '../funtional/pipe.js';
import { unprocessableEntityError } from '../error/httpError.js';

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
    validateWith(hasValidName, () => unprocessableEntityError('Map must have a valid name')),
    validateWith(hasValidDimensions, () => unprocessableEntityError('Map must have valid dimensions')),
    validateWith(hasValidUserId, () => unprocessableEntityError('Map must have a valid user id assigned'))
);

export const validateUserData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('User must have a valid username')),
    validateWith(hasValidEmail, () => unprocessableEntityError('User must have a valid email address')),
    validateWith(hasValidPassword, () => unprocessableEntityError('User must have a valid password of at least 8 characters'))
);

export const validateObstacleData = pipe(
    validateWith(hasValidDimensions, () => unprocessableEntityError('Obstacle must have valid dimensions'))
)

export const validateWaypointData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('Waypoint must have a valid name')),
);
