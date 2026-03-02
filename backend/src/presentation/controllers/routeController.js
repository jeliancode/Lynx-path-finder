import { ResultMonad } from '../../domain/shared/funtional/monad.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../domain/shared/error/httpSuccess.js';

export const routeController = (routeService) => ({
    createRoute: async (req, res, next) => {
        const { startX, startY, endX, endY, stopIds } = req.body;
        const { mapId } = req.params;
        const map = req.map;
        const creationResult = await routeService.createNewRoute({ mapId, startX, startY, endX, endY, stopIds  }, map);

        ResultMonad.fold(
            (error) => next(error),
            (newRoute) => createdSuccessfully(res)('Route created successfully')(newRoute)
        )(creationResult);
    },

    getPossibleRoute: async (req, res, next) => {
        const { startX, startY, endX, endY } = req.body;
        const map = req.map;

        const validationResult = await routeService.getPossibleRoute(
            { startX, startY, endX, endY },
            map
        );

        ResultMonad.fold(
            (error) => next(error),
            () => completedSuccessfully(res)(
                'Almost one route was found.'
            )()
        )(validationResult);
    },

    validateRouteWaypoints: async (req, res, next) => {
        const { id } = req.params;
        const map = req.map;
        const validationResult = await routeService.validateRouteWaypoints(id, map);

        ResultMonad.fold(
            (error) => next(error),
            () => completedSuccessfully(res)('Map waypoints validated successfully')()
        )(validationResult);
    },

    getAllRoutes: async (req, res, next) => {
        const getResult = await routeService.fetchAllRoutes();

        ResultMonad.fold(
            (error) => next(error),
            (routes) => completedSuccessfully(res)('All routes get successfully')(routes)
        )(getResult);
    },

    getRouteById: async (req, res, next) => {
        const { id } = req.params;
        const getResult = await routeService.fetchRouteById(id);
            
        ResultMonad.fold(
            (error) => next(error),
            (route) => completedSuccessfully(res)('Route get successfully')(route)
        )(getResult);
    },

    updateRoute:async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const map = req.map;
        const updateResult = await routeService.modifyRouteById(id, updateData, map);
        
        ResultMonad.fold(
            (error) => next(error),
            (updatedRoute) => completedSuccessfully(res)('Route updated successfully')(updatedRoute)
        )(updateResult);
    },

    deleteRoute: async (req, res, next) => {
        const { id } = req.params;
        const deleteResult = await routeService.removeRouteById(id);

        ResultMonad.fold(
            (error) => next(error),
            () => deletedSuccessfully(res)('Route deleted successfully')()
        )(deleteResult);
    },

    analyzeRoutePerformance: async (req, res, next) => {
        const { startX, startY, endX, endY } = req.body;
        const map = req.map;

        const result = await routeService.analyzeRoutePerformance(
            { startX, startY, endX, endY },
            map
        );

        ResultMonad.fold(
            (error) => next(error),
            () => completedSuccessfully(res)(
                'Análisis de rendimiento completado sin fugas de memoria ni cuellos de botella detectados.'
            )()
        )(result);
    },
});