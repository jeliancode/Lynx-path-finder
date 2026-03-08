import { detectCycleDFS } from "../pathFinder/detectCycleDFS.js";

const buildDependencyGraph = (entities) => {

  const graph = new Map();

  for (const entity of entities) {
    graph.set(entity.id, entity.dependencies || []);
  }

  return graph;
};

const getNeighborsFromGraph = (graph) => (node) =>
  graph.get(node.id) || [];

export const validateNoCyclicDependencies = (entities) => {

  const graph = buildDependencyGraph(entities);

  const getNeighbors = (entity) =>
    (entity.dependencies || []).map((id) => ({ id }));

  const detectCycles = detectCycleDFS(getNeighbors);

  return detectCycles(entities);
};