const toKey = (node) =>
  typeof node === "object"
    ? JSON.stringify(node)
    : String(node);

const reconstructPath = (cameFrom, startKey, endKey) => {
  const path = [];
  let current = endKey;

  while (current) {
    path.unshift(current);
    current = cameFrom.get(current);
  }

  return path[0] === startKey ? path : [];
};

export const bfsAlgorithm =
  (getNeighbors) =>
  (start, goal) => {

    const queue = [start];
    const visited = new Set();
    const cameFrom = new Map();

    const startKey = toKey(start);
    const goalKey = goal ? toKey(goal) : null;

    visited.add(startKey);

    while (queue.length > 0) {

      const current = queue.shift();
      const currentKey = toKey(current);

      if (goalKey && currentKey === goalKey) {
        return {
          found: true,
          path: reconstructPath(cameFrom, startKey, goalKey)
        };
      }

      const neighbors = getNeighbors(current) || [];

      for (const neighbor of neighbors) {

        const neighborKey = toKey(neighbor);

        if (!visited.has(neighborKey)) {

          visited.add(neighborKey);
          cameFrom.set(neighborKey, currentKey);
          queue.push(neighbor);
        }
      }
    }

    return {
      found: false,
      path: []
    };
  };
  