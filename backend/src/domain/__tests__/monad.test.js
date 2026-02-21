import {
  Ok,
  Error,
  ResultMonad,
  fromPromise
} from '../shared/funtional/monad.js';

describe('Result Monad', () => {

  describe('Ok / Error constructors', () => {
    it('Ok should create a successful Result', () => {
      const result = Ok(10);

      expect(result.isOk).toBe(true);
      expect(result.isError).toBe(false);
      expect(result.value).toBe(10);
    });

    it('Error should create a failed Result', () => {
      const error = new Error('Boom');
      const result = Error(error);

      expect(result.isOk).toBe(false);
      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });

  describe('map', () => {
    it('should apply function to Ok value', () => {
      const result = ResultMonad.map(x => x * 2)(Ok(5));

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should not apply function to Error', () => {
      const error = Error('fail');
      const fn = jest.fn();

      const result = ResultMonad.map(fn)(error);

      expect(result).toBe(error);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('chain', () => {
    it('should chain function returning Result when Ok', () => {
      const fn = (x) => Ok(x + 1);

      const result = ResultMonad.chain(fn)(Ok(1));

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(2);
    });

    it('should stop chain when Error', () => {
      const error = Error('fail');
      const fn = jest.fn();

      const result = ResultMonad.chain(fn)(error);

      expect(result).toBe(error);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('fold', () => {

    it('should execute onOk when Result is Ok', () => {
      const onOk = jest.fn();
      const onError = jest.fn();

      ResultMonad.fold(onError, onOk)(Ok(42));

      expect(onOk).toHaveBeenCalledWith(42);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should execute onError when Result is Error', () => {
      const onOk = jest.fn();
      const onError = jest.fn();

      ResultMonad.fold(onError, onOk)(Error('fail'));

      expect(onError).toHaveBeenCalledWith('fail');
      expect(onOk).not.toHaveBeenCalled();
    });
  });

  describe('fromPromise', () => {
    it('should return Ok when promise resolves', async () => {
      const fn = () => Promise.resolve(10);

      const result = await fromPromise(fn);

      expect(result.isOk).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should return Error when promise rejects', async () => {
      const error = new Error('async fail');
      const fn = () => Promise.reject(error);

      const result = await fromPromise(fn);

      expect(result.isError).toBe(true);
      expect(result.value).toBe(error);
    });
  });
});
