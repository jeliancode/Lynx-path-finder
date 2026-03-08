import { ResultMonad } from "../../domain/shared/funtional/monad.js";
import { completedSuccessfully } from "../../domain/shared/error/httpSuccess.js";

export const performanceController = (performanceService) => ({
  analyzeRoutePerformance: async (req, res, next) => {
    const { startPoint, endPoint, obstacles } = req.body;
    const map = req.map;
    const performanceResult =
      await performanceService
        .analyzeRoutePerformance(map)({
          startPoint,
          endPoint,
          obstacles
        });

    ResultMonad.fold(
      (error) => next(error),
      (result) =>
        completedSuccessfully(res)(
          "Performance analysis completed successfully"
        )(result)
    )(performanceResult);
  }
});