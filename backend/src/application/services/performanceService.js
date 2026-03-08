import { getValidNeighbors } from "../../domain/pathfinding/getValidNeighbors.js";
import { aStarPathfinder } from "../../domain/pathfinding/aStarPathfinder.js";
import { manhattanDistance } from "../../domain/pathfinding/heuristics.js";
import { analyzePathfindingPerformance } from "../../domain/performance/withPerformanceAnalysis.js";

export const performanceService = () => ({
  analyzeRoutePerformance: (map) => ({ startPoint, endPoint, obstacles }) => {
    const neighbors = getValidNeighbors({
      width: map.width,
      height: map.height,
      obstacles
    });
    const strategy = aStarPathfinder(manhattanDistance)(neighbors);
    const analyzer = analyzePathfindingPerformance(strategy);

    return analyzer({
      startPoint,
      endPoint
    });
  }
});