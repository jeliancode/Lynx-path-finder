import { aStarPathfinder } from '../pathFinder/aStarAlgorithm.js';

describe('A* Pathfinding Algorithm - Strategy Based', () => {
  
  const setup = () => {
    const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    
    const getNeighborsMock = (node) => {
      const neighbors = [];
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      dirs.forEach(([dx, dy]) => {
        const nx = node.x + dx, ny = node.y + dy;
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) neighbors.push({ x: nx, y: ny });
      });
      return neighbors;
    };

    const pathfinder = aStarPathfinder(manhattan)(getNeighborsMock);

    return { pathfinder, manhattan };
  };

  it('Should find a valid path on an empty 5x5 grid', () => {
    const { pathfinder } = setup();
    const start = { x: 0, y: 0 };
    const end = { x: 2, y: 2 };

    const result = pathfinder(start, end);

    expect(result).toHaveProperty('path');
    expect(result.distance).toBe(4);
    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(end);
  });

  it('Should return distance 0 if start equals end', () => {
    const { pathfinder } = setup();
    const point = { x: 2, y: 2 };

    const result = pathfinder(point, point);

    expect(result.distance).toBe(0);
    expect(result.path).toEqual([point]);
  });

  it('Should avoid "virtual" obstacles via getNeighbors strategy', () => {
    const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    
    const getNeighborsWithWall = (node) => {
      const neighbors = [];
      [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dx, dy]) => {
        const nx = node.x + dx, ny = node.y + dy;
        const isWall = nx === 1;
        if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3 && !isWall) {
          neighbors.push({ x: nx, y: ny });
        }
      });
      return neighbors;
    };

    const pathfinder = aStarPathfinder(manhattan)(getNeighborsWithWall);
    const start = { x: 0, y: 1 };
    const end = { x: 2, y: 1 };

    expect(() => pathfinder(start, end)).toThrow('No possible route found');
  });

  it('Should handle edge cases like unreachable targets (Negative Test)', () => {
    const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    const getIsolatedNeighbors = () => [];

    const pathfinder = aStarPathfinder(manhattan)(getIsolatedNeighbors);
    
    expect(() => pathfinder({ x: 0, y: 0 }, { x: 4, y: 4 }))
      .toThrow('No possible route found');
  });

  it('Should result in an Error object with 422 status (Custom Error Verification)', () => {
    const { pathfinder } = setup();
    try {
      pathfinder({ x: 0, y: 0 }, { x: 99, y: 99 });
    } catch (error) {
      expect(error.status).toBe(422);
      expect(error.message).toBe('No possible route found');
    }
  });
});