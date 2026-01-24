import validateWith from "../validator/validator.js";

const toKey = ({ x, y }) => `${x},${y}`;

const obstacleSetFrom = (obstacles) =>
  new Set(obstacles.map(toKey));

const isBlocked = (obstacleSet) => (point) =>
  obstacleSet.has(toKey(point));

const validateNotBlocked = (obstacleSet, label) =>
  validateWith(
    (point) => !isBlocked(obstacleSet)(point),
    () => new Error(`El punto de ${label} está bloqueado`)
  );


export const validateStartEndPoints =
  obstacles =>
  start =>
  end => {
    const obstacleSet = obstacleSetFrom(obstacles);

    validateNotBlocked(obstacleSet, "inicio")(start);
    validateNotBlocked(obstacleSet, "destino")(end);

    return { start, end };
  };
