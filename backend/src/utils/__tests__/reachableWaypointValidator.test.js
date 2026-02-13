import { validateWaypointsReachable } from '../validator/reachableWaypointValidator.js';
import { unprocessableEntityError } from '../error/httpError.js';
import { Ok, Error as ResultError } from '../funtional/monad.js';


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

    const result =
      validateWaypointsReachable(path)(waypoints);

    expect(result).toEqual(Ok(waypoints));
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

  const result =
    validateWaypointsReachable(path)(waypoints);

    expect(result.isError).toBe(true);
    expect(result.value).toEqual(
      unprocessableEntityError('Some waypoints are not reachable in the given path')
    );
    });

  it('should not throw error when waypoints list is empty', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    
    const result =
      validateWaypointsReachable(path)([]);

    expect(result).toEqual(Ok([]));
    });
});
