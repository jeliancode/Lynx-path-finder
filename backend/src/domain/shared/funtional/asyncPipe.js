import { Ok, ResultMonad } from "./monad.js";

const asyncPipe = (...functions) => (initialValue) =>
  functions.reduce(
    async (resultPromise, currentFunction) => 
      ResultMonad.chain(currentFunction)(await resultPromise),
    Ok(initialValue)
  );

export default asyncPipe;
