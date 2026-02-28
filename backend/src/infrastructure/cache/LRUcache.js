import pipe from '../../domain/shared/funtional/pipe.js';
import { Ok } from '../../domain/shared/funtional/monad.js';

export const createLRUCache = ({ max = 50, maxAge = 30000 } = {}) => {

const evictIfNeeded = (currentState) => {
  if (currentState.size <= max) return currentState;

  return pipe(
    (state) => Ok(Array.from(state.entries())),
    (entries) => Ok(entries.sort((a, b) => a[1].expiry - b[1].expiry)),
    (sorted) => Ok(sorted.slice(1)),
    (remaining) => Ok(new Map(remaining))
  )(currentState).value;
};

const set = (key, value) => {
  const newEntry = { value, expiry: now() + maxAge };

  const updatedEntries = Array.from(state.entries())
    .filter(([k]) => k !== key)
    .concat([[key, newEntry]]);

  const newState = new Map(updatedEntries);
  
  state = evictIfNeeded(newState);
};
};