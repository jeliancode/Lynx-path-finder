import { validateStartEndPoints } from '../validator/routePointsValidator.js';
import { unprocessableEntityError } from '../error/httpError.js';

describe('validateStartEndPoints validator', () => {
  const start = { x: 0, y: 0 };
  const end = { x: 4, y: 4 };

  it('should return start and end when both points are not blocked', () => {
    const obstacles = [{ x: 1, y: 1 }];

    const result = validateStartEndPoints(obstacles)(start)(end);

    expect(result).toEqual({ start, end });
  });

  it('should throw error if start point is blocked', () => {
    const obstacles = [{ x: 0, y: 0 }];

    const run = () =>
      validateStartEndPoints(obstacles)(start)(end);

    expect(run).toThrow(unprocessableEntityError('Start point is blocked by an obstacle'));
  });

  it('should throw error if end point is blocked', () => {
    const obstacles = [{ x: 4, y: 4 }];

    const run = () =>
      validateStartEndPoints(obstacles)(start)(end);

    expect(run).toThrow(unprocessableEntityError('Destiny point is blocked by an obstacle'));
  });

  it('should throw start error first if both points are blocked', () => {
    const obstacles = [
      { x: 0, y: 0 },
      { x: 4, y: 4 }
    ];

    const run = () =>
      validateStartEndPoints(obstacles)(start)(end);

    expect(run).toThrow(
      unprocessableEntityError('Start point is blocked by an obstacle')
    );
  });
});
