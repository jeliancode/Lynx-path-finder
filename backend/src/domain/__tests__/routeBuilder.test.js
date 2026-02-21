import buildRouteThroughWaypoints from '../pathFinder/routeBuilder.js';

describe('buildRouteThroughWaypoints - Recursive Logic', () => {
  
  const setup = () => {
    const mockPathfinder = jest.fn();
    const builder = buildRouteThroughWaypoints(mockPathfinder);
    return { builder, mockPathfinder };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should build a direct route when no waypoints are provided', () => {
    const { builder, mockPathfinder } = setup();
    const start = { x: 0, y: 0 };
    const end = { x: 2, y: 0 };

    mockPathfinder.mockReturnValue({
      path: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
      distance: 2
    });

    const result = builder(start, [], end);

    expect(mockPathfinder).toHaveBeenCalledTimes(1);
    expect(mockPathfinder).toHaveBeenCalledWith(start, end);
    expect(result.distance).toBe(2);
    expect(result.path).toHaveLength(3);
  });

  it('Should correctly concatenate multiple segments avoiding duplicate nodes', () => {
    const { builder, mockPathfinder } = setup();
    const start = { x: 0, y: 0 };
    const waypoints = [{ x: 1, y: 0 }];
    const end = { x: 2, y: 0 };

    mockPathfinder.mockReturnValueOnce({
      path: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
      distance: 1
    });
    mockPathfinder.mockReturnValueOnce({
      path: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
      distance: 1
    });

    const result = builder(start, waypoints, end);

    expect(result.path).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ]);
    expect(result.distance).toBe(2);
  });

  it('Should maintain the correct order of waypoints (Edge Case: Long chain)', () => {
    const { builder, mockPathfinder } = setup();
    const start = { x: 0, y: 0 };
    const waypoints = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
    const end = { x: 3, y: 3 };

    mockPathfinder.mockReturnValue({ path: [], distance: 0 });

    builder(start, waypoints, end);

    expect(mockPathfinder).toHaveBeenNthCalledWith(1, start, waypoints[0]);
    expect(mockPathfinder).toHaveBeenNthCalledWith(2, waypoints[0], waypoints[1]);
    expect(mockPathfinder).toHaveBeenNthCalledWith(3, waypoints[1], end);
  });

  it('Should bubble up errors if the pathfinder fails (Negative Test)', () => {
    const { builder, mockPathfinder } = setup();
    
    mockPathfinder.mockImplementation(() => {
      throw new Error('No possible route found');
    });

    expect(() => builder({ x: 0, y: 0 }, [], { x: 5, y: 5 }))
      .toThrow('No possible route found');
  });
});