import { unprocessableEntity } from "../error/httpError.js";

const manhattanDistance = (from, to) =>
  Math.abs(from.x - to.x) + Math.abs(from.y - to.y);

export const calculateAStarPath = (mapConfig, start, end) => {
  const { width, height, obstacles } = mapConfig;

  const obstacleSet = new Set(obstacles.map(obstacle => `${obstacle.x},${obstacle.y}`));
  const closedSet = new Set();

  const openNodes = [];
  const openNodesByKey = new Map();

  const startNode = {
    ...start,
    costFromStart: 0,
    estimatedTotal: manhattanDistance(start, end),
    parent: null
  };

  openNodes.push(startNode);
  openNodesByKey.set(`${start.x},${start.y}`, startNode);

  while (openNodes.length > 0) {
    openNodes.sort((a, b) => a.f - b.f);
    const currentNode = openNodes.shift();
    openNodesByKey.delete(`${currentNode.x},${currentNode.y}`);

    if (currentNode.x === end.x && currentNode.y === end.y) {
      const path = reconstructPath(currentNode);
      return {
        path,
        distance: currentNode.g - 1
      };
    }

    closedSet.add(`${currentNode.x},${currentNode.y}`);

    const neighbors = [
      { x: currentNode.x + 1, y: currentNode.y },
      { x: currentNode.x - 1, y: currentNode.y },
      { x: currentNode.x, y: currentNode.y + 1 },
      { x: currentNode.x, y: currentNode.y - 1 }
    ];

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;

      if (
        neighbor.x < 0 || neighbor.x >= width ||
        neighbor.y < 0 || neighbor.y >= height ||
        obstacleSet.has(key) ||
        closedSet.has(key)
      ) continue;

      const gScore = currentNode.g + 1;

      const existing = openNodesByKey.get(key);

      if (!existing) {
        const node = {
          ...neighbor,
          g: gScore,
          f: gScore + manhattanDistance(neighbor, end),
          parent: currentNode
        };
        openNodes.push(node);
        openNodesByKey.set(key, node);
      } else if (gScore < existing.g) {
        existing.g = gScore;
        existing.f = gScore + manhattanDistance(neighbor, end);
        existing.parent = currentNode;
      }
    }
  }

  unprocessableEntity('No possible route found');
};

const reconstructPath = (node) => {
  const path = [];
  let current = node;
  while (current) {
    path.push({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path.reverse();
};
