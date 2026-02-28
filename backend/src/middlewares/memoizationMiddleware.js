import pipe from '../domain/shared/funtional/pipe.js';
import { Ok, Error } from '../domain/shared/funtional/monad.js';
import { createLRUCache } from '../infrastructure/cache/LRUcache.js';

export const createMemoizationMiddleware = (config = {}) => {
  const cache = createLRUCache(config);

  const checkMethod = (req) => 
    req.method === 'GET' ? Ok(req) : Error("No es un método cacheable");

  const generateKey = (req) => 
    Ok(`${req.method}:${req.originalUrl}`);

  const tryGetFromCache = (key) => {
    const cached = cache.get(key);
    return cached ? Error({ type: 'CACHE_HIT', data: cached }) : Ok(key);
  };

  const interceptResponse = (res) => (key) => {
    const originalJson = res.json.bind(res);
    
    res.json = (body) => {
      cache.set(key, body);
      return originalJson(body);
    };
    
    return Ok("Interceptor montado");
  };

  return (req, res, next) => {
    const result = pipe(
      checkMethod,
      generateKey,
      tryGetFromCache,
      interceptResponse(res)
    )(req);

    if (result.isError) {
      if (result.value?.type === 'CACHE_HIT') {
        return res.json(result.value.data);
      }
      return next();
    }

    next();
  };
};