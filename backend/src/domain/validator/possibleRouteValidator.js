import { Ok, Error } from '../shared/funtional/monad.js';
import { notFoundError } from '../shared/error/httpError.js';
import { hasValidPath } from '../pathFinder/bfsAlgorithm.js';

export const validatePossibleRoute = (map) => (start) => (end) => {
  const pathExists = hasValidPath({
    width: map.width,
    height: map.height,
    startPoint: start,
    endPoint: end,
    obstacles: map.obstacles
  });

  if (!pathExists) {
    return Error(
      notFoundError(
        'No hay ninguna ruta válida desde el punto de inicio hasta el destino.'
      )
    );
  }

  return Ok({ start, end });
};