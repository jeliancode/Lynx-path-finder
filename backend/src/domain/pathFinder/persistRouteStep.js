import { fromPromise } from "../shared/funtional/monad.js";

export const persistRoute =
  (routeRepository) =>
  (route) =>
    fromPromise(() =>
      routeRepository.createRoute(route)
    );
