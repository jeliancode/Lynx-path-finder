import { calculateAStarPath } from '../pathFinder/aStarAlgorithm.js';

describe('A* Pathfinding Algorithm', () => {

  const baseMap = {
    width: 5,
    height: 5,
    obstacles: []
  };

  it('Should find a valid path without obstacles', () => {
    const start = { x: 0, y: 0 };
    const end = { x: 4, y: 4 };

    const result = calculateAStarPath(baseMap, start, end);

    expect(result).toHaveProperty('path');
    expect(result).toHaveProperty('distance');
    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(end);
    expect(result.distance).toBe(8);
  });

  it('Should avoid obstacles', () => {
    const map = {
      ...baseMap,
      obstacles: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 }
      ]
    };

    const start = { x: 0, y: 0 };
    const end = { x: 2, y: 2 };

    const result = calculateAStarPath(map, start, end);

    const obstaclePositions = map.obstacles.map(o => `${o.x},${o.y}`);

    result.path.forEach(step => {
      expect(obstaclePositions)
        .not.toContain(`${step.x},${step.y}`);
    });

    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(end);
  });

  it('Should return distance 0 if start equals end', () => {
    const start = { x: 2, y: 2 };
    const end = { x: 2, y: 2 };

    const result = calculateAStarPath(baseMap, start, end);

    expect(result.distance).toBe(0);
    expect(result.path).toEqual([{ x: 2, y: 2 }]);
  });

  it('Should throw error if no possible route exists', () => {
    const map = {
      width: 3,
      height: 3,
      obstacles: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 }
      ]
    };

    const start = { x: 0, y: 1 };
    const end = { x: 2, y: 1 };

    expect(() =>
      calculateAStarPath(map, start, end)
    ).toThrow('No possible route found');
  });

  it('Path length should match distance + 1', () => {
    const start = { x: 0, y: 0 };
    const end = { x: 3, y: 0 };

    const result = calculateAStarPath(baseMap, start, end);

    expect(result.path.length).toBe(result.distance + 1);
  });

});
