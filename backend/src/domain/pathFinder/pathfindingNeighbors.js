const getValidNeighbors = (mapConfig) => (node) => {
  const { width, height, obstacles } = mapConfig;
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));

  return [
    { x: node.x + 1, y: node.y },
    { x: node.x - 1, y: node.y },
    { x: node.x, y: node.y + 1 },
    { x: node.x, y: node.y - 1 }
  ].filter(neighbor => 
    neighbor.x >= 0 && neighbor.x < width &&
    neighbor.y >= 0 && neighbor.y < height &&
    !obstacleSet.has(`${neighbor.x},${neighbor.y}`)
  );
};

export default getValidNeighbors;
