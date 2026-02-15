export const manhattanDistance = (from, to) =>
  Math.abs(from.x - to.x) + Math.abs(from.y - to.y);

export const euclideanDistance = (from, to) =>
  Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
