import { validateMapConfiguration } from '../validator/mapConfigValidator.js';
import { unprocessableEntityError } from '../error/httpError.js';

describe('validateMapConfiguration validator', () => {
  const validMap = {
    obstacles: [{ x: 1, y: 1 }],
    waypoints: [{ x: 2, y: 2 }]
  };

  it('should return map when obstacles and waypoints exist', () => {
    const result = validateMapConfiguration(validMap);

    expect(result).toBe(validMap);
  });

  it('should throw error when map has no obstacles', () => {
    const mapWithoutObstacles = {
      obstacles: [],
      waypoints: [{ x: 2, y: 2 }]
    };

    const run = () => validateMapConfiguration(mapWithoutObstacles);

    expect(run).toThrow(
      unprocessableEntityError('Map must contain obstacles')
    );
  });

  it('should throw error when obstacles are missing', () => {
    const mapWithoutObstaclesProp = {
      waypoints: [{ x: 2, y: 2 }]
    };

    const run = () => validateMapConfiguration(mapWithoutObstaclesProp);

    expect(run).toThrow(
      unprocessableEntityError('Map must contain obstacles')
    );
  });

  it('should throw error when map has no waypoints', () => {
    const mapWithoutWaypoints = {
      obstacles: [{ x: 1, y: 1 }],
      waypoints: []
    };

    const run = () => validateMapConfiguration(mapWithoutWaypoints);

    expect(run).toThrow(
      unprocessableEntityError('Map must contain waypoints')
    );
  });

  it('should throw obstacles error first if both are missing', () => {
    const invalidMap = {
      obstacles: [],
      waypoints: []
    };

    const run = () => validateMapConfiguration(invalidMap);

    expect(run).toThrow(
      unprocessableEntityError('Map must contain obstacles')
    );
  });
});
