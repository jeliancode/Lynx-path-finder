const Result = (isOk, value) => ({
  isOk,
  isErr: !isOk,
  value
});

export const Ok = (value) => Result(true, value);
export const Err = (error) => Result(false, error);

const map = (fn) => (result) =>
  result.isOk
    ? Ok(fn(result.value))
    : result;

const chain = (fn) => (result) =>
  result.isOk
    ? fn(result.value)
    : result;

const fold = (onErr, onOk) => (result) =>
  result.isOk
    ? onOk(result.value)
    : onErr(result.value);

export const ResultMonad = {
  Ok,
  Err,
  map,
  chain,
  fold
};
