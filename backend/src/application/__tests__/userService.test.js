jest.mock(
  '../../infrastructure/repositories/userRepository.js',
  () => ({
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn()
  })
);

jest.mock(
  '../../utils/validator/entityDataValidator.js',
  () => ({
    validateUserData: jest.fn()
  })
);

import {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
  modifyUserById,
  removeUserById
} from '../services/userService.js';

import * as userRepository from '../../infrastructure/repositories/userRepository.js';
import { validateUserData } from '../../utils/validator/entityDataValidator.js';
import { Ok, Error } from '../../utils/funtional/monad.js';

describe('User service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {
    it('Should return Ok when user is created successfully', async () => {
      const userData = {
        username: 'jesus maldonado',
        email: 'test@gmail.com',
        password: 'admin123'
      };

      const createdUser = { id: '1', ...userData };

      validateUserData.mockReturnValue(Ok(userData));
      userRepository.createUser.mockResolvedValue(createdUser);

      const result = await createNewUser(userData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(createdUser);
    });

    it('Should return Error when user data is invalid', async () => {
      validateUserData.mockReturnValue(
        Error(new Error('Invalid user data'))
      );

      const result = await createNewUser({});

      expect(result.isError).toBe(true);
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllUsers', () => {
    it('Should return Ok with all users', async () => {
      const users = [{ id: '1' }];

      userRepository.getAllUsers.mockResolvedValue(users);

      const result = await fetchAllUsers();

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(users);
    });
  });

  describe('fetchUserById', () => {
    it('Should return Ok when user exists', async () => {
      const user = { id: '1' };

      userRepository.getUserById.mockResolvedValue(user);

      const result = await fetchUserById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(user);
    });

    it('Should return Error when user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      const result = await fetchUserById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User not found');
    });
  });

  describe('modifyUserById', () => {
    it('Should return Ok when user is updated', async () => {
      const updateData = { username: 'julian' };
      const updatedUser = { id: '1', ...updateData };

      userRepository.updateUserById.mockResolvedValue(updatedUser);

      const result = await modifyUserById('1', updateData);

      expect(result.isOk).toBe(true);
      expect(result.value).toEqual(updatedUser);
    });

    it('Should return Error when user to update does not exist', async () => {
      userRepository.updateUserById.mockResolvedValue(null);

      const result = await modifyUserById('999', {});

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User to update not found');
    });
  });

  describe('removeUserById', () => {
    it('Should return Ok when user is deleted', async () => {
      userRepository.deleteUserById.mockResolvedValue(true);

      const result = await removeUserById('1');

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(true);
    });

    it('Should return Error when user to delete does not exist', async () => {
      userRepository.deleteUserById.mockResolvedValue(null);

      const result = await removeUserById('999');

      expect(result.isError).toBe(true);
      expect(result.value.message).toBe('User to delete not found');
    });
  });
});
