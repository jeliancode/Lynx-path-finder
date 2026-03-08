import { validateMapConfiguration } from '../validator/mapConfigValidator.js';
import { unprocessableEntityError } from '../shared/error/httpError.js';
import { Ok, Error } from '../shared/funtional/monad.js';


describe('validateMapConfiguration validator', () => {
  const validMap = {
    obstacles: [{ x: 1, y: 1 }],
    waypoints: [{ x: 2, y: 2 }]
  };

  it('should return Ok(map) when obstacles and waypoints exist', () => {
    const result = validateMapConfiguration(validMap);

    expect(result).toEqual(Ok(validMap));
  });


  it('should throw error when map has no obstacles', () => {
    const mapWithoutObstacles = {
      obstacles: [],
      waypoints: [{ x: 2, y: 2 }]
    };

    const result = validateMapConfiguration(mapWithoutObstacles);

    expect(result.isError).toBe(true);
    expect(result.value).toEqual(
      unprocessableEntityError('Map must contain obstacles')
    );
  });

  it('should throw error when obstacles are missing', () => {
    const mapWithoutObstaclesProp = {
      waypoints: [{ x: 2, y: 2 }]
    };

    const result = validateMapConfiguration(mapWithoutObstaclesProp);

    expect(result.isError).toBe(true);
    expect(result.value).toEqual(
      unprocessableEntityError('Map must contain obstacles')
    );
  });

  it('should throw error when map has no waypoints', () => {
    const mapWithoutWaypoints = {
      obstacles: [{ x: 1, y: 1 }],
      waypoints: []
    };

    const result = validateMapConfiguration(mapWithoutWaypoints);

    expect(result.value).toEqual(
      unprocessableEntityError('Map must contain waypoints')
    );
  });

  it('should throw obstacles error first if both are missing', () => {
    const invalidMap = {
      obstacles: [],
      waypoints: []
    };

    const result = validateMapConfiguration(invalidMap);

    expect(result.value).toEqual(
      unprocessableEntityError('Map must contain obstacles')
    );
  });
});
