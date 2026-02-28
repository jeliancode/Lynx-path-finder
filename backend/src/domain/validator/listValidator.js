import { ResultMonad, Ok } from "../shared/funtional/monad.js";

const checkEach = (validator) => (list) =>
  list.reduce(
    (acc, item) =>
      ResultMonad.chain(() =>
        ResultMonad.map(() => list)(validator(item))
      )(acc),
    Ok(list)
  );

export default checkEach;
