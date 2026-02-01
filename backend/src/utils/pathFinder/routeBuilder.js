import { calculateAStarPath } from '../pathFinder/aStarAlgorithm.js';

export const buildRouteThroughWaypoints = (mapConfig, start, waypoints, end) => {
  const points = [start, ...waypoints, end];

  const helper = (index, result) => {
    if (index >= points.length - 1) return result;

    const from = points[index];
    const to = points[index + 1];
    const { path, distance } = calculateAStarPath(mapConfig, from, to);

    const segment = index > 0 ? path.slice(1) : path;

    return helper(index + 1, {
      path: [...result.path, ...segment],
      distance: result.distance + distance
    });
  };

  return helper(0, { path: [], distance: 0 });
};
