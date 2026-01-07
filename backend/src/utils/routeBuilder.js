import { calculateAStarPath } from './pathFinder.js';

export const buildRouteThroughWaypoints = (
    mapConfig,
    start,
    waypoints,
    end
) => {
    const points = [start, ...waypoints, end];

    let fullPath = [];
    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const from = points[i];
        const to = points[i + 1];

        const { path, distance } = calculateAStarPath(
            mapConfig,
            from,
            to
        );

        if (i > 0) path.shift();

        fullPath.push(...path);
        totalDistance += distance;
    }

    return {
        path: fullPath,
        distance: totalDistance
    };
};
