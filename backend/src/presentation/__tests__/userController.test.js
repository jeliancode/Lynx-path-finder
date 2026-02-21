import { userController } from '../controllers/userController.js';
import { Ok, Error } from '../../domain/shared/funtional/monad.js';

jest.mock('../../domain/shared/error/httpSuccess.js', () => ({
  createdSuccessfully: jest.fn(),
  completedSuccessfully: jest.fn(),
  deletedSuccessfully: jest.fn()
}));

import {
  createdSuccessfully,
  completedSuccessfully,
  deletedSuccessfully
} from '../../domain/shared/error/httpSuccess.js';

describe('User Controller - Standardized Tests', () => {

  const setup = () => {
    const mockUserService = {
      createNewUser: jest.fn(),
      fetchAllUsers: jest.fn(),
      fetchUserById: jest.fn(),
      modifyUserById: jest.fn(),
      removeUserById: jest.fn()
    };

    const controller = userController(mockUserService);
    const mockRes = {};
    const mockNext = jest.fn();

    const mockSuccessResponse = () => {
      const responseFn = jest.fn();
      const messageFn = jest.fn().mockReturnValue(responseFn);
      return { messageFn, responseFn };
    };

    return { 
      controller, 
      mockUserService, 
      mockRes, 
      mockNext, 
      mockSuccessResponse 
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('Should create user and return 201 status with the new entity', async () => {
      const { controller, mockUserService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const userData = { username: 'jesus', email: 'test@gmail.com', password: 'password123' };
      const createdUser = { id: 'user-1', ...userData };

      mockUserService.createNewUser.mockResolvedValue(Ok(createdUser));
      createdSuccessfully.mockReturnValue(messageFn);

      await controller.createUser({ body: userData }, mockRes, mockNext);

      expect(mockUserService.createNewUser).toHaveBeenCalledWith(userData);
      expect(createdSuccessfully).toHaveBeenCalledWith(mockRes);
      expect(messageFn).toHaveBeenCalledWith('User created successfully');
      expect(responseFn).toHaveBeenCalledWith(createdUser);
    });

    it('Should propagate service validation errors to next()', async () => {
      const { controller, mockUserService, mockRes, mockNext } = setup();
      const validationError = { status: 400, message: 'Email already exists' };

      mockUserService.createNewUser.mockResolvedValue(Error(validationError));

      await controller.createUser({ body: {} }, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(validationError);
    });
  });

  describe('getUserById', () => {
    it('Should return user when found by ID', async () => {
      const { controller, mockUserService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      const user = { id: '1', username: 'jesus' };

      mockUserService.fetchUserById.mockResolvedValue(Ok(user));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.getUserById({ params: { id: '1' } }, mockRes, mockNext);

      expect(mockUserService.fetchUserById).toHaveBeenCalledWith('1');
      expect(responseFn).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('Should call modification service and return updated data', async () => {
      const { controller, mockUserService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();
      
      const updateData = { username: 'Julian' };
      mockUserService.modifyUserById.mockResolvedValue(Ok({ id: '1', ...updateData }));
      completedSuccessfully.mockReturnValue(messageFn);

      await controller.updateUser({ params: { id: '1' }, body: updateData }, mockRes, mockNext);

      expect(mockUserService.modifyUserById).toHaveBeenCalledWith('1', updateData);
      expect(messageFn).toHaveBeenCalledWith('User updated successfully');
    });
  });

  describe('deleteUser', () => {
    it('Should execute deletion and return no_content success', async () => {
      const { controller, mockUserService, mockRes, mockNext, mockSuccessResponse } = setup();
      const { messageFn, responseFn } = mockSuccessResponse();

      mockUserService.removeUserById.mockResolvedValue(Ok(true));
      deletedSuccessfully.mockReturnValue(messageFn);

      await controller.deleteUser({ params: { id: '1' } }, mockRes, mockNext);

      expect(mockUserService.removeUserById).toHaveBeenCalledWith('1');
      expect(messageFn).toHaveBeenCalledWith('User deleted successfully');
      expect(responseFn).toHaveBeenCalled();
    });
  });
});