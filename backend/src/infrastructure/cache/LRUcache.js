import pipe from '../../domain/shared/funtional/pipe.js';
import { Ok } from '../../domain/shared/funtional/monad.js';

export const createLRUCache = ({ max = 50, maxAge = 30000 } = {}) => {
  let state = new Map();
  const now = () => Date.now();

  const evictIfNeeded = (currentState) => {
    if (currentState.size <= max) return currentState;

    return pipe(
      (s) => Ok(Array.from(s.entries())),
      (entries) => Ok(entries.sort((a, b) => a.expiry - b.expiry)),
      (sorted) => Ok(sorted.slice(1)),
      (remaining) => Ok(new Map(remaining))
    )(currentState).value;
  };

  const get = (key) => {
    const entry = state.get(key);
    if (!entry) return null;
    
    if (now() > entry.expiry) {
      state.delete(key);
      return null;
    }
    return entry.value;
  };

  const set = (key, value) => {
    const newEntry = { value, expiry: now() + maxAge };

    const updatedEntries = Array.from(state.entries())
      .filter(([k]) => k !== key)
      .concat([[key, newEntry]]);

    const newState = new Map(updatedEntries);
    state = evictIfNeeded(newState);
  };

  return { get, set };
};
