import { jest } from '@jest/globals';

jest.unstable_mockModule(
    '../../infrastructure/repositories/obstacleRepository.js',
    () => ({
        createOstacle: jest.fn(),
        createMultipleObstacles: jest.fn(),
        getAllObstacles: jest.fn(),
        getObstacleById: jest.fn(),
        updateObstacleById: jest.fn(),
        deleteObstacleById: jest.fn()
    })
);

const obstacleRepository = await import ('../../infrastructure/repositories/obstacleRepository.js')
const {
    createObstacle,
    createMultipleObstacles,
    fetchAllObstacles,
    fetchObstacleById,
    modifyObstacleById,
    removeObstacleById
} = await import('../services/obstacleService.js')

describe('Obstacle service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createNewRoute', () => {
        it('deberia crear un obstaculo con datos validos', async () => {
            const obstacleData = { x: 5, y: 4, size: 2, mapId: '1' };
            const createdObstacle = { id: '1', ...obstacleData };

            obstacleRepository.createObstacle.mockResolvedValue(createdObstacle);

            const result = await createObstacle(obstacleData);

            expect(obstacleRepository.createObstacle).toHaveBeenCalledWith(obstacleData);
            expect(result).toEqual(createdObstacle);
        });

        it('deberia lanzar error si los datos son invalidos', async () => {
            const invalidData = { x: '', y: '4', size: '2'};
        })
    });
});
