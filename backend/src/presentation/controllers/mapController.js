import { ResultMonad } from '../../utils/funtional/monad.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const mapController = (mapService) => ({
    createMap: async (req, res, next) => {
        const { name, width, height, userId } = req.body;
        const creationResult = await mapService.createNewMap({ name, width, height, userId });

        ResultMonad.fold(
            (error) => next(error),
            (map) =>createdSuccessfully(res)('Map created successfully')(map)
        )(creationResult);       
    },

    getAllMaps: async (req, res, next) => {
        const getResult = await mapService.fetchAllMaps();
        
        ResultMonad.fold(
            (error) => next(error),
            (maps) => completedSuccessfully(res)('All maps get successfully')(maps)
        )(getResult);
    },

    getMapById: async (req, res, next) => {
        const { id } = req.params;
        const getResult = await mapService.fetchMapById(id);

        ResultMonad.fold(
            (error) => next(error),
            (map) => completedSuccessfully(res)('Map get successfully')(map)
        )(getResult);
    },

    updateMap: async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const updatedResult = await mapService.modifyMapById(id, updateData);
            
        ResultMonad.fold(
            (error) => next(error),
            (updatedMap) =>completedSuccessfully(res)('Map updated successfully')(updatedMap)
        )(updatedResult);
    },

    deleteMap: async (req, res, next) => {
        const { id } = req.params;
        const deleteResult = await mapService.removeMapById(id);

        ResultMonad.fold(
            (error) => next(error),
            () => deletedSuccessfully(res)('Map deleted successfully')()
        )(deleteResult);
    },
});
