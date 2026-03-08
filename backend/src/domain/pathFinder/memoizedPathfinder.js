export const memoizedPathfinder = (pathfinder) => {

  const cache = new Map();

  const key = (start, end) =>
    `${start.x},${start.y}-${end.x},${end.y}`;

  return (start, end) => {

    const cacheKey = key(start, end);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const result = pathfinder(start, end);

    cache.set(cacheKey, result);

    return result;
  };
};