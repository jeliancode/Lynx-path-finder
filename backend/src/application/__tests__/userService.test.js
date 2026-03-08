import { userService } from '../services/userService.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/validator/userDataValidator.js');
import validateUserData from '../../domain/validator/userDataValidator.js';

describe('User Service - Full Suite', () => {

  const setup = () => {
    const mockUserRepository = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUserById: jest.fn(),
      deleteUserById: jest.fn(),
      getUserByUsername: jest.fn()
    };

    const service = userService({ userRepository: mockUserRepository });

    return { service, mockUserRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {

    it('Should return Ok when user is created successfully', async () => {
      const { service, mockUserRepository } = setup();

      const userData = {
        username: 'jesus maldonado',
        email: 'test@gmail.com',
        password: 'admin123'
      };

      const createdUser = { id: '1', ...userData };

      validateUserData.mockReturnValue(Ok(userData));
      mockUserRepository.createUser.mockResolvedValue(createdUser);

      const result = await service.createNewUser(userData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdUser);
    });

    it('Should return Error when user data is invalid', async () => {
      const { service, mockUserRepository } = setup();

      validateUserData.mockReturnValue(
        Error({ message: 'Invalid user data' })
      );

      const result = await service.createNewUser({});

      expect(result.isError).toBe(true);
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

  });

  describe('fetchAllUsers', () => {

    it('Should return Ok with all users', async () => {
      const { service, mockUserRepository } = setup();

      const users = [{ id: '1' }];

      mockUserRepository.getAllUsers.mockResolvedValue(users);

      const result = await service.fetchAllUsers();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(users);
    });

  });

  describe('fetchUserById', () => {

    it('Should return Ok when user exists', async () => {
      const { service, mockUserRepository } = setup();

      const user = { id: '1' };

      mockUserRepository.getUserById.mockResolvedValue(user);

      const result = await service.fetchUserById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(user);
    });

    it('Should return Error when user does not exist', async () => {
      const { service, mockUserRepository } = setup();

      mockUserRepository.getUserById.mockResolvedValue(null);

      const result = await service.fetchUserById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User not found');
    });

  });

  describe('modifyUserById', () => {

    it('Should return Ok when user is updated', async () => {
      const { service, mockUserRepository } = setup();

      const updateData = { username: 'julian' };
      const updatedUser = { id: '1', ...updateData };

      mockUserRepository.updateUserById.mockResolvedValue(updatedUser);

      const result = await service.modifyUserById('1', updateData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updatedUser);
    });

    it('Should return Error when user to update does not exist', async () => {
      const { service, mockUserRepository } = setup();

      mockUserRepository.updateUserById.mockResolvedValue(null);

      const result = await service.modifyUserById('999', {});

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User to update not found');
    });

  });

  describe('removeUserById', () => {

    it('Should return Ok when user is deleted', async () => {
      const { service, mockUserRepository } = setup();

      mockUserRepository.deleteUserById.mockResolvedValue(true);

      const result = await service.removeUserById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('Should return Error when user to delete does not exist', async () => {
      const { service, mockUserRepository } = setup();

      mockUserRepository.deleteUserById.mockResolvedValue(null);

      const result = await service.removeUserById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User to delete not found');
    });

  });

  describe('fetchUserByUsername', () => {

    it('Should return Ok when user exists by username', async () => {
      const { service, mockUserRepository } = setup();

      const user = { id: '1', username: 'jesus' };

      mockUserRepository.getUserByUsername.mockResolvedValue(user);

      const result = await service.fetchUserByUsername('jesus');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(user);
    });

    it('Should return Error when user not found by username', async () => {
      const { service, mockUserRepository } = setup();

      mockUserRepository.getUserByUsername.mockResolvedValue(null);

      const result = await service.fetchUserByUsername('unknown');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User not found by username');
    });

  });

});
