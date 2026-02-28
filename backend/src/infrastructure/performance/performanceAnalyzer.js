import { performance } from 'node:perf_hooks';

export const analyzeExecution = async (fn) => {
  const startMemory = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  const result = await fn();

  if (global.gc) {
    global.gc();
  }

  const endMemory = process.memoryUsage().heapUsed;
  const endTime = performance.now();

  const memoryDiff = endMemory - startMemory;
  const executionTime = endTime - startTime;

  return {
    result,
    metrics: {
      executionTimeMs: executionTime,
      memoryUsedBytes: memoryDiff
    }
  };
};
