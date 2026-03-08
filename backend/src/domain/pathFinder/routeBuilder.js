const buildRouteThroughWaypoints = (pathfinder) => (start, waypoints, end) => {
  const points = [start, ...waypoints, end];

  const calculateSegments = (index, currentResult) => {

    if (index >= points.length - 1) return currentResult;

    const from = points[index];
    const to = points[index + 1];

    const { path, distance, visitedNodes } = pathfinder(from, to);

    const cleanPath = index > 0 ? path.slice(1) : path;

    return calculateSegments(index + 1, {
      path: [...currentResult.path, ...cleanPath],
      distance: currentResult.distance + distance,
      visitedNodes: new Set([
        ...currentResult.visitedNodes,
        ...visitedNodes
      ])
    });
  };

  return calculateSegments(0, {
    path: [],
    distance: 0,
    visitedNodes: new Set()
  });
};

export default buildRouteThroughWaypoints;
