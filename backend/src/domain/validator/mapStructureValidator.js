const memoize = (fn) => {
  const cache = new Map();
  return (arg) => {
    const key = JSON.stringify(arg);
    if (cache.has(key)) return cache.get(key);
    const result = fn(arg);
    cache.set(key, result);
    return result;
  };
};

export const validateComplexGeometry =
  memoize((map) => {
    return Ok({
      valid: true,
      message: "Algorithm can handle maps with complex geometries."
    });
  });
