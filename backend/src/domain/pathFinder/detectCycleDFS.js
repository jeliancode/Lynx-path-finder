import { Error, Ok } from "../shared/funtional/monad.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const toKey = (node) =>
  typeof node === "object"
    ? JSON.stringify(node)
    : String(node);

export const detectCycleDFS = (getNeighbors) => (nodes) => {

  const visited = new Set();
  const visiting = new Set();

  const dfs = (node) => {

    const key = toKey(node);

    if (visiting.has(key)) {
      return true;
    }

    if (visited.has(key)) {
      return false;
    }

    visiting.add(key);

    const neighbors = getNeighbors(node) || [];

    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    visiting.delete(key);
    visited.add(key);

    return false;
  };

  for (const node of nodes) {
    if (dfs(node)) {
      return Error(
        unprocessableEntityError(
          "Cyclic dependency detected in map configuration"
        )
      );
    }
  }

  return Ok(nodes);
};
