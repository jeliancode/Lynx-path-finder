import { validateStartEndPoints } from '../validator/routePointsValidator.js';
import { unprocessableEntityError } from '../error/httpError.js';
import { Ok, Error as ResultError } from '../funtional/monad.js';

describe('validateStartEndPoints validator', () => {
  const start = { x: 0, y: 0 };
  const end = { x: 4, y: 4 };

  it('should return Ok({start, end}) when both points are not blocked', () => {
    const obstacles = [{ x: 1, y: 1 }];

    const result =
      validateStartEndPoints(obstacles)(start)(end);

    expect(result).toEqual(
      Ok({ start, end })
    );
  });

  it('should return Error if start point is blocked', () => {
    const obstacles = [{ x: 0, y: 0 }];

    const result =
      validateStartEndPoints(obstacles)(start)(end);

    expect(result).toEqual(
      ResultError(
        unprocessableEntityError('Start point is blocked by an obstacle')
      )
    );
  });

  it('should return Error if end point is blocked', () => {
    const obstacles = [{ x: 4, y: 4 }];

    const result =
      validateStartEndPoints(obstacles)(start)(end);

    expect(result).toEqual(
      ResultError(
        unprocessableEntityError('Destiny point is blocked by an obstacle')
      )
    );
  });

  it('should return start error first if both are blocked', () => {
    const obstacles = [
      { x: 0, y: 0 },
      { x: 4, y: 4 }
    ];

    const result =
      validateStartEndPoints(obstacles)(start)(end);

    expect(result.value).toEqual(
      unprocessableEntityError('Start point is blocked by an obstacle')
    );
  });
});
