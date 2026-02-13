import { Ok, Error } from '../funtional/monad.js';

const validateWith = (predicate, errorFactory) => (value) => 
  predicate(value)
    ? Ok(value)
    : Error(errorFactory());

export default validateWith;
