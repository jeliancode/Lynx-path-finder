const heuristic = (a, b) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const calculateAStarPath = (mapConfig, start, end) => {
  const { width, height, obstacles } = mapConfig;

  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const closedSet = new Set();

  const openSet = [];
  const openSetMap = new Map();

  const startNode = {
    ...start,
    g: 0,
    f: heuristic(start, end),
    parent: null
  };

  openSet.push(startNode);
  openSetMap.set(`${start.x},${start.y}`, startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    openSetMap.delete(`${current.x},${current.y}`);

    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(current);
      return {
        path,
        distance: current.g - 1
      };
    }

    closedSet.add(`${current.x},${current.y}`);

    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ];

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;

      if (
        neighbor.x < 0 || neighbor.x >= width ||
        neighbor.y < 0 || neighbor.y >= height ||
        obstacleSet.has(key) ||
        closedSet.has(key)
      ) continue;

      const gScore = current.g + 1;

      const existing = openSetMap.get(key);

      if (!existing) {
        const node = {
          ...neighbor,
          g: gScore,
          f: gScore + heuristic(neighbor, end),
          parent: current
        };
        openSet.push(node);
        openSetMap.set(key, node);
      } else if (gScore < existing.g) {
        existing.g = gScore;
        existing.f = gScore + heuristic(neighbor, end);
        existing.parent = current;
      }
    }
  }

  throw new Error('No se encontró una ruta posible');
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
