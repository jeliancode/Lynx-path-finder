const Result = (isOk, value) => ({
  isOk,
  isError: !isOk,
  value
});

export const Ok = (value) => Result(true, value);
export const Error = (error) => Result(false, error);

const map = (fn) => (result) =>
  result.isOk
    ? Ok(fn(result.value))
    : result;

const chain = (fn) => (result) =>
  result.isOk
    ? fn(result.value)
    : result;

const fold = (onError, onOk) => (result) =>
  result.isOk
    ? onOk(result.value)
    : onError(result.value);

export const ResultMonad = {
  Ok,
  Error: Error,
  map,
  chain,
  fold
};

export const fromPromise = async (fn) => {
  try {
    return Ok(await fn());
  } catch (error) {
    return Error(error);
  }
};
