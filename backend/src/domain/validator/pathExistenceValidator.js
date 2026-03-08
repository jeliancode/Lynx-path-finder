import { bfsAlgorithm } from "../pathFinder/bfsAlgorithm.js";
import getValidNeighbors from "../pathFinder/pathfindingNeighbors.js";
import { Ok, Error } from "../shared/funtional/monad.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";

const buildPathSearch =
  (map, obstacles) => {

    const neighbors = getValidNeighbors({
      width: map.width,
      height: map.height,
      obstacles
    });

    return bfsAlgorithm(neighbors);
  };

export const validatePathExists =
  (map, obstacles) =>
  ({ start, end, ...data }) => {

    const search = buildPathSearch(map, obstacles);

    const result = search(start, end);

    if (!result.found) {
      return Error(
        unprocessableEntityError(
          "No valid path exists between start and destination"
        )
      );
    }

    return Ok({ start, end, ...data });
  };