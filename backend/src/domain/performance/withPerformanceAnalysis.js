import { Ok, Error } from "../shared/funtional/monad.js";
import { internalServerError } from "../shared/error/httpError.js";

const MAX_TIME_MS = 500;
const MAX_MEMORY_BYTES = 50 * 1024 * 1024;
const MAX_SEARCH_TIME = 200;

export const withPerformanceAnalysis = (pathfinder) => {
  return (map) => {
    return ({ startPoint, endPoint, obstacles }) => {

      const startMemory = process.memoryUsage().heapUsed;
      const startTime = performance.now();

      let result;

      try {
        result = pathfinder(startPoint, endPoint, obstacles);

        const elapsed = performance.now() - startTime;

        if (elapsed > MAX_SEARCH_TIME) {
          return Error(
            internalServerError(
              `Pathfinding timeout exceeded (${elapsed.toFixed(2)} ms)`
            )
          );
        }

      } catch (err) {
        return Error(
          internalServerError("Pathfinding execution failed")
        );
      }

      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;

      const executionTime = endTime - startTime;
      const memoryUsed = endMemory - startMemory;

      if (executionTime > MAX_TIME_MS) {
        return Error(
          internalServerError(
            `Performance issue detected: execution time ${executionTime.toFixed(
              2
            )} ms exceeds limit`
          )
        );
      }

      if (memoryUsed > MAX_MEMORY_BYTES) {
        return Error(
          internalServerError(
            `Possible memory leak detected: ${memoryUsed} bytes allocated`
          )
        );
      }

      if (result?.visitedNodes && result.visitedNodes > map.width * map.height) {
        return Error(
          internalServerError(
            "Search algorithm explored too many nodes. Possible bottleneck."
          )
        );
      }

      return Ok({
        message:
          "Performance analysis completed without memory leaks or bottlenecks detected.",
        metrics: {
          executionTime,
          memoryUsed,
          visitedNodes: result?.visitedNodes ?? 0,
          pathLength: result?.path?.length ?? 0,
        },
      });
    };
  };
};