import { validateWaypointsReachable } from '../validator/reachableWaypointValidator.js';
import { unprocessableEntityError } from '../error/httpError.js';

describe('validateWaypointsReachable', () => {

  it('should not throw error when all waypoints are reachable', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 }
    ];

    const waypoints = [
      { x: 1, y: 0 },
      { x: 2, y: 1 }
    ];

    expect(() =>
      validateWaypointsReachable(path)(waypoints)
    ).not.toThrow();
  });

  it('should throw error when some waypoint is not reachable', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ];

    const waypoints = [
      { x: 1, y: 0 },
      { x: 5, y: 5 }
    ];

    expect(() =>
      validateWaypointsReachable(path)(waypoints)
    ).toThrow(unprocessableEntityError('Some waypoints are not reachable in the given path'));
  });

  it('should not throw error when waypoints list is empty', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];

    const waypoints = [];

    expect(() =>
      validateWaypointsReachable(path)(waypoints)
    ).not.toThrow();
  });
});
