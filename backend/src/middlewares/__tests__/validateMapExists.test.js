jest.mock('../../infrastructure/repositories/mapRepository.js');

import { validateMapExists } from '../validateMapExists.js';
import { getMapById } from '../../infrastructure/repositories/mapRepository.js';
import { unprocessableEntityError, notFoundError } from '../../utils/error/httpError.js';

const buildReq = (overrides = {}) => ({
  params: {},
  ...overrides
});

const buildNext = () => jest.fn();

describe('validateMapExists middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 422 if mapId is missing', async () => {
    const req = buildReq();
    const res = {};
    const next = buildNext();

    const middleware = validateMapExists();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(unprocessableEntityError('Map ID is required'));
  });

  test('should return 404 if map is not found', async () => {
    const req = buildReq({
      params: { mapId: 'map-123' }
    });
    const res = {};
    const next = buildNext();

    getMapById.mockResolvedValue(null);

    const middleware = validateMapExists();

    await middleware(req, res, next);

    expect(getMapById).toHaveBeenCalledWith('map-123');
    expect(next).toHaveBeenCalledWith(notFoundError('Map not found'));
  });

  test('should attach map to req and call next if map exists', async () => {
    const fakeMap = { id: 'map-123', name: 'Test map' };

    const req = buildReq({
      params: { mapId: 'map-123' }
    });
    const res = {};
    const next = buildNext();

    getMapById.mockResolvedValue(fakeMap);

    const middleware = validateMapExists();

    await middleware(req, res, next);

    expect(req.map).toEqual(fakeMap);
    expect(next).toHaveBeenCalledWith();
  });

  test('should forward unexpected errors to next', async () => {
    const dbError = new Error('DB crashed');

    const req = buildReq({
      params: { mapId: 'map-123' }
    });
    const res = {};
    const next = buildNext();

    getMapById.mockRejectedValue(dbError);

    const middleware = validateMapExists();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});
