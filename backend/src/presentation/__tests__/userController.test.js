jest.mock('../../application/services/userService.js', () => ({
  createNewUser: jest.fn(),
  fetchAllUsers: jest.fn(),
  fetchUserById: jest.fn(),
  modifyUserById: jest.fn(),
  removeUserById: jest.fn()
}));

jest.mock('../../utils/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import * as userService from '../../application/services/userService.js';
import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../utils/error/httpSuccess.js';

const mockRes = () => ({});
const mockNext = jest.fn();

describe('User Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('Should create user and return 201 response', async () => {
      const req = {
        body: {
          username: 'jesus',
          email: 'test@gmail.com',
          password: 'admin123'
        }
      };
      const res = mockRes();

      const createdUser = { id: '1', ...req.body };

      userService.createNewUser.mockResolvedValue(createdUser);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      createdSuccessfully.mockReturnValue(messageFn);

      await createUser(req, res, mockNext);

      expect(userService.createNewUser).toHaveBeenCalledWith(req.body);
      expect(createdSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('User created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdUser);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should throw error if service fails', async () => {
      const error = new Error('Error');
      const req = { body: {} };
      const res = mockRes();

      userService.createNewUser.mockRejectedValue(error);

      await createUser(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllUsers', () => {
    it('Should return all users', async () => {
      const req = {};
      const res = mockRes();
      const users = [{ id: '1' }, { id: '2' }];

      userService.fetchAllUsers.mockResolvedValue(users);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getAllUsers(req, res, mockNext);

      expect(userService.fetchAllUsers).toHaveBeenCalled();
      expect(completedSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('All users get successfully');
      expect(responseFn).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('Should return user by id', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();
      const user = { id: '1', username: 'jesus' };

      userService.fetchUserById.mockResolvedValue(user);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await getUserById(req, res, mockNext);

      expect(userService.fetchUserById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('User get successfully');
      expect(responseFn).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('Should update user successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { username: 'Julian' }
      };
      const res = mockRes();
      const updatedUser = { id: '1', ...req.body };

      userService.modifyUserById.mockResolvedValue(updatedUser);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      completedSuccessfully.mockReturnValue(messageFn);

      await updateUser(req, res, mockNext);

      expect(userService.modifyUserById).toHaveBeenCalledWith('1', req.body);
      expect(messageFn).toHaveBeenCalledWith('User updated successfully');
      expect(responseFn).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('Should delete user successfully', async () => {
      const req = { params: { id: '1' } };
      const res = mockRes();

      userService.removeUserById.mockResolvedValue(true);

      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      deletedSuccessfully.mockReturnValue(messageFn);

      await deleteUser(req, res, mockNext);

      expect(userService.removeUserById).toHaveBeenCalledWith('1');
      expect(deletedSuccessfully).toHaveBeenCalledWith(res);
      expect(messageFn).toHaveBeenCalledWith('User deleted successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });
});
