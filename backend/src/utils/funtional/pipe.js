import { ResultMonad, Ok } from "./monad.js";

const pipe = (...functions) => (value) =>
  functions.reduce(
    (result, currentFunction) => ResultMonad.chain(currentFunction)(result),
    Ok(value)
  );

export default pipe;
