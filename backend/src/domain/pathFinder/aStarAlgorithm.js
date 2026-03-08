import { unprocessableEntityError } from "../shared/error/httpError.js";

const reconstructPath = (node) => {
  const path = [];
  let current = node;
  while (current) {
    path.push({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path.reverse();
};

export const aStarPathfinder = (heuristic) => (getNeighbors) => (start, end) => {

  const closedSet = new Set();
  const openNodes = [];
  const openNodesByKey = new Map();
  const visitedNodes = new Set();

  const startNode = {
    ...start,
    g: 0,
    f: heuristic(start, end),
    parent: null
  };

  openNodes.push(startNode);
  openNodesByKey.set(`${start.x},${start.y}`, startNode);

  while (openNodes.length > 0) {

    openNodes.sort((a, b) => a.f - b.f);
    const currentNode = openNodes.shift();
    const currentKey = `${currentNode.x},${currentNode.y}`;
    openNodesByKey.delete(currentKey);
    visitedNodes.add(currentKey);

    if (currentNode.x === end.x && currentNode.y === end.y) {
      return {
        path: reconstructPath(currentNode),
        distance: currentNode.g,
        visitedNodes
      };
    }

    closedSet.add(currentKey);

    for (const neighbor of getNeighbors(currentNode)) {

      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closedSet.has(neighborKey)) continue;

      const gScore = currentNode.g + 1;
      const existing = openNodesByKey.get(neighborKey);

      if (!existing || gScore < existing.g) {

        const node = {
          ...neighbor,
          g: gScore,
          f: gScore + heuristic(neighbor, end),
          parent: currentNode
        };

        if (!existing) {
          openNodes.push(node);
        } else {
          Object.assign(existing, node);
        }

        openNodesByKey.set(neighborKey, existing || node);
      }
    }
  }

  throw unprocessableEntityError('No possible route found');
};