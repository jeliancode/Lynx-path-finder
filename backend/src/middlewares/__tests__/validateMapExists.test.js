import { validateMapExists } from '../validateMapExists.js';
import * as mapRepository from '../../infrastructure/repositories/mapRepository.js';
import { unprocessableEntityError, notFoundError } from '../../domain/shared/error/httpError.js';

jest.mock('../../infrastructure/repositories/mapRepository.js');

const buildReq = (overrides = {}) => ({
  params: {},
  ...overrides
});

const buildNext = () => jest.fn();

describe('validateMapExists middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next with 422 if mapId is missing', async () => {
    const req = buildReq({ params: { mapId: null } });
    const res = {};
    const next = buildNext();

    const middleware = validateMapExists();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(unprocessableEntityError('Map ID is required'));
    expect(mapRepository.getMapById).not.toHaveBeenCalled();
  });

  test('should call next with 404 if map is not found in database', async () => {
    const req = buildReq({ params: { mapId: 'map-123' } });
    const res = {};
    const next = buildNext();

    mapRepository.getMapById.mockResolvedValue(null);

    const middleware = validateMapExists();
    await middleware(req, res, next);

    expect(mapRepository.getMapById).toHaveBeenCalledWith('map-123');
    expect(next).toHaveBeenCalledWith(notFoundError('Map not found'));
  });

  test('should attach map to req and call next() without arguments if map exists', async () => {
    const fakeMap = { id: 'map-123', name: 'Test map' };
    const req = buildReq({ params: { mapId: 'map-123' } });
    const res = {};
    const next = buildNext();

    mapRepository.getMapById.mockResolvedValue(fakeMap);

    const middleware = validateMapExists();
    await middleware(req, res, next);

    expect(req.map).toEqual(fakeMap);
    expect(next).toHaveBeenCalledWith();
  });

  test('should forward exceptions captured by fromPromise to next', async () => {
    const dbError = new Error('Connection lost');
    const req = buildReq({ params: { mapId: 'map-123' } });
    const res = {};
    const next = buildNext();

    mapRepository.getMapById.mockRejectedValue(dbError);

    const middleware = validateMapExists();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});