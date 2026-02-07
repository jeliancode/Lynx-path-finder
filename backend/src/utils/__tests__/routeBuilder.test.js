jest.mock('../pathFinder/aStarAlgorithm.js', () => ({
  calculateAStarPath: jest.fn()
}));

import { buildRouteThroughWaypoints } from '../pathFinder/routeBuilder.js';
import { calculateAStarPath } from '../pathFinder/aStarAlgorithm.js';

describe('buildRouteThroughWaypoints', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should build direct route without waypoints', () => {
    const mapConfig = {};
    const start = { x: 0, y: 0 };
    const end = { x: 2, y: 0 };

    calculateAStarPath.mockReturnValue({
      path: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 }
      ],
      distance: 2
    });

    const result = buildRouteThroughWaypoints(mapConfig, start, [], end);

    expect(calculateAStarPath).toHaveBeenCalledWith(mapConfig, start, end);

    expect(result.path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ]);

    expect(result.distance).toBe(2);
  });

  it('Should build route through multiple waypoints', () => {
    const mapConfig = {};
    const start = { x: 0, y: 0 };
    const waypoints = [{ x: 2, y: 0 }, { x: 2, y: 2 }];
    const end = { x: 4, y: 2 };

    calculateAStarPath
      .mockReturnValueOnce({
        path: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ],
        distance: 2
      })
      .mockReturnValueOnce({
        path: [
          { x: 2, y: 0 },
          { x: 2, y: 1 },
          { x: 2, y: 2 }
        ],
        distance: 2
      })
      .mockReturnValueOnce({
        path: [
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 }
        ],
        distance: 2
      });

    const result = buildRouteThroughWaypoints(
      mapConfig,
      start,
      waypoints,
      end
    );

    expect(calculateAStarPath).toHaveBeenCalledTimes(3);

    expect(result.path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 }
    ]);

    expect(result.distance).toBe(6);
  });

  it('Should not duplicate waypoint nodes between segments', () => {
    const mapConfig = {};
    const start = { x: 0, y: 0 };
    const waypoint = { x: 1, y: 0 };
    const end = { x: 2, y: 0 };

    calculateAStarPath
      .mockReturnValueOnce({
        path: [
          { x: 0, y: 0 },
          { x: 1, y: 0 }
        ],
        distance: 1
      })
      .mockReturnValueOnce({
        path: [
          { x: 1, y: 0 },
          { x: 2, y: 0 }
        ],
        distance: 1
      });

    const result = buildRouteThroughWaypoints(
      mapConfig,
      start,
      [waypoint],
      end
    );

    expect(result.path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ]);

    expect(result.distance).toBe(2);
  });

  it('Should call A* with correct ordered points', () => {
    const mapConfig = {};
    const start = { x: 0, y: 0 };
    const waypoints = [{ x: 1, y: 1 }];
    const end = { x: 2, y: 2 };

    calculateAStarPath.mockReturnValue({
      path: [],
      distance: 0
    });

    buildRouteThroughWaypoints(mapConfig, start, waypoints, end);

    expect(calculateAStarPath).toHaveBeenNthCalledWith(
      1,
      mapConfig,
      start,
      waypoints[0]
    );

    expect(calculateAStarPath).toHaveBeenNthCalledWith(
      2,
      mapConfig,
      waypoints[0],
      end
    );
  });

});
