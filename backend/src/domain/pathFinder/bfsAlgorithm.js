export const hasValidPath = ({
  width,
  height,
  startPoint,
  endPoint,
  obstacles = []
}) => {
  const obstacleSet = new Set(
    obstacles.map(o => `${o.x},${o.y}`)
  );

  const visited = new Set();
  const queue = [startPoint];

  const isValid = (x, y) =>
    x >= 0 &&
    y >= 0 &&
    x < width &&
    y < height &&
    !obstacleSet.has(`${x},${y}`) &&
    !visited.has(`${x},${y}`);

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    if (x === endPoint.x && y === endPoint.y) {
      return true;
    }

    visited.add(`${x},${y}`);

    const directions = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 }
    ];

    for (const next of directions) {
      if (isValid(next.x, next.y)) {
        queue.push(next);
      }
    }
  }

  return false;
};
