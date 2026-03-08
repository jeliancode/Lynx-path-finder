const range = (start, length) =>
  Array.from({ length }, (_, i) => start + i);

export const expandObstacle = ({ x, y, width, height }) =>
  range(x, width).flatMap((xi) =>
    range(y, height).map((yi) => [xi, yi])
  );

export const expandObstacles = (obstacles) =>
  obstacles.flatMap(expandObstacle);
