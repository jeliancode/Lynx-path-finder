import validateWith from "./validator.js";
import pipe from "../funtional/pipe.js";

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
    validateWith(hasValidName, () => new Error("El mapa debe tener un nombre valido")),
    validateWith(hasValidDimensions, () => new Error("El mapa debe contener dimensiones validas")),
    validateWith(hasValidUserId, () => new Error("El mapa debe tener un user id asignado"))
);

export const validateUserData = pipe(
    validateWith(hasValidName, () => new Error("El usuario debe tener un nombre de usuario valido")),
    validateWith(hasValidEmail, () => new Error("El usuario debe tener un correo electrónico valido")),
    validateWith(hasValidPassword, () => new Error("El usuario debe tener una contraseña valida de al menos 8 caracteres"))
);

export const validateObstacleData = pipe(
    validateWith(hasValidDimensions, () => new Error("El obstáculo debe tener dimensiones validas"))
)

export const validateWaypointData = pipe(
    validateWith(hasValidName, () => new Error("El punto de parada debe tener un nombre valido")),
);
