import { Ok, Error } from '../shared/funtional/monad.js';

const MAX_EXECUTION_TIME = 200;
const MAX_MEMORY_INCREASE = 5 * 1024 * 1024;

export const validatePerformanceMetrics = (metrics) => {
  const { executionTimeMs, memoryUsedBytes } = metrics;

  if (executionTimeMs > MAX_EXECUTION_TIME) {
    return Error({
      status: 500,
      message: 'Se detectó un posible cuello de botella en el tiempo de ejecución.'
    });
  }

  if (memoryUsedBytes > MAX_MEMORY_INCREASE) {
    return Error({
      status: 500,
      message: 'Se detectó un posible crecimiento anormal de memoria.'
    });
  }

  return Ok(metrics);
};