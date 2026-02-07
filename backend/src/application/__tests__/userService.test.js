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

describe('User service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {

    it('Should create a new user with valid data', async () => {
      const userData = {
        username: 'jesus maldonado',
        email: 'test@gmail.com',
        password: 'admin123'
      };

      const createdUser = { id: '1', ...userData };

      validateUserData.mockImplementation(() => {});
      userRepository.createUser.mockResolvedValue(createdUser);

      const result = await createNewUser(userData);

      expect(validateUserData).toHaveBeenCalledWith(userData);
      expect(userRepository.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });

    it('Should throw error if user has invalid data', async () => {
      validateUserData.mockImplementation(() => {
        throw new Error('Invalid user data');
      });

      await expect(createNewUser({}))
        .rejects
        .toThrow('Invalid user data');

      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllUsers', () => {

    it('Should return all users', async () => {
      const users = [
        {
          id: '1',
          username: 'jesus maldonado',
          email: 'test@gmail.com',
          password: 'admin123'
        }
      ];

      userRepository.getAllUsers.mockResolvedValue(users);

      const result = await fetchAllUsers();

      expect(userRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('fetchUserById', () => {

    it('Should return user if exists', async () => {
      const user = {
        id: '1',
        username: 'jesus maldonado',
        email: 'test@gmail.com',
        password: 'admin123'
      };

      userRepository.getUserById.mockResolvedValue(user);

      const result = await fetchUserById('1');

      expect(userRepository.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('Should throw error if user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(fetchUserById('999'))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('modifyUserById', () => {

    it('Should update user with valid data', async () => {
      const updateData = {
        username: 'julian',
        email: 'updateTest@gmail.com'
      };

      const updatedUser = { id: '1', ...updateData };

      userRepository.updateUserById.mockResolvedValue(updatedUser);

      const result = await modifyUserById('1', updateData);

      expect(userRepository.updateUserById)
        .toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('removeUserById', () => {

    it('Should remove user', async () => {
      userRepository.deleteUserById.mockResolvedValue(true);

      const result = await removeUserById('1');

      expect(userRepository.deleteUserById).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
