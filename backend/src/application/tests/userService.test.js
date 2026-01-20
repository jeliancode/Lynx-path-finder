import { jest } from '@jest/globals';

jest.unstable_mockModule(
  '../../infrastructure/repositories/userRepository.js',
  () => ({
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn()
    })
);

const userRepository = await import('../../infrastructure/repositories/userRepository.js');
const {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
  modifyUserById,
  removeUserById
} = await import('../services/userService.js');

describe('User service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createNewUser', () => {
      it('deberia crear un usuario con datos validos', async () => {
        const userData = { username : 'jesus maldonado', email: 'test@gmail.com', password: 'admin123' };
        const createdUser = {id: '1', ...userData};

        userRepository.createUser.mockResolvedValue(createdUser);

        const result = await createNewUser(userData);

        expect(userRepository.createUser).toHaveBeenCalledWith(userData);
        expect(result).toEqual(createdUser);
      });

      it('deberia lanzar erro si los datos son invalidos', async () =>{
        const invalidData = { username: 1234, email: '' };

        await expect(createNewUser(invalidData))
          .rejects
          .toThrow('Datos de usuario inválidos: El nombre de usuario y el correo electrónico son requeridos');
      });
    });

    describe('fetchAllUser', () => {
      it('deberia devolver todos los usuarios', async () => {
        const users =[{ id: "1", username : 'jesus maldonado', email: 'test@gmail.com', password: 'admin123' }];

        userRepository.getAllUsers.mockResolvedValue(users);

        const result = await fetchAllUsers();

        expect(userRepository.getAllUsers).toHaveBeenCalled();
        expect(result).toEqual(users);
      })
    });

    describe('fetchUserById', () => {
      it('deberia devolver un usuario si existe', async () => {
        const user = { id: '1', username : 'jesus maldonado', email: 'test@gmail.com', password: 'admin123' };

        userRepository.getUserById.mockResolvedValue(user);

        const result = await fetchUserById('1');

        expect(userRepository.getUserById).toHaveBeenCalledWith('1');
        expect(result).toEqual(user);
      });

      it('deberia lanzar error si el usuario no existe', async () => {
        userRepository.getUserById.mockResolvedValue(null);

        await expect(fetchUserById('999'))
          .rejects
          .toThrow('Usuario no encontrado');
      });
    });

    describe('modifyUserById', () => {
      it('deberia actualizar un usuario con datos validos', async () => {
        const updateData = { username: 'julian', email: 'updateTest@gmail.com' };
        const updatedUser = { id: 'id', ...updateData};

        userRepository.updateUserById.mockResolvedValue(updatedUser);
        const result = await modifyUserById('1', updateData);

        expect(userRepository.updateUserById)
          .toHaveBeenCalledWith('1', updateData);
        expect(result).toEqual(updatedUser);
      });
    });

    describe('removeUserById', () => {
      it('deberia eliminar un mapa', async () => {
        userRepository.deleteUserById.mockResolvedValue(true);

        const result = await removeUserById('1');

        expect(userRepository.deleteUserById)
          .toHaveBeenCalledWith('1');
        expect(result).toBe(true);
      });
    });
});
