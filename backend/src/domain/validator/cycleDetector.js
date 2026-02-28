import { Ok, Error } from '../shared/funtional/monad.js';
import { badRequestError } from '../shared/error/httpError.js';

const hasCycle = (connections) => {
  const graph = new Map();

  connections.forEach(({ source, target }) => {
    if (!graph.has(source)) graph.set(source, []);
    graph.get(source).push(target);
  });

  const visited = new Set();
  const stack = new Set();

  const dfs = (node) => {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (dfs(neighbor)) return true;
    }

    stack.delete(node);
    return false;
  };

  for (const node of graph.keys()) {
    if (dfs(node)) return true;
  }

  return false;
};

export const validateNoCycles = (mapData) => {
  const connections = mapData?.mapConfig?.connections || [];

  if (hasCycle(connections)) {
    return Error(
      badRequestError('Se encontró una dependencia cíclica en la configuración del mapa.')
    );
  }

  return Ok(mapData);
};

