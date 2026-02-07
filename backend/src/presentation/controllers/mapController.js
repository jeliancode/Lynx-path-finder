import * as mapService from '../../application/services/mapService.js';
import { createdSuccessfully, completedSuccessfully, deletedSuccessfully } from '../../utils/error/httpSuccess.js';

export const createMap = async (req, res, next) => {
    try {
        const { name, width, height, userId } = req.body;
        const newMap = await mapService.createNewMap({ name, width, height, userId });
        
        createdSuccessfully(res)('Map created successfully')(newMap);
    } catch (error) {
        next(error);
    }
};

export const getAllMaps = async (req, res, next) => {
    try {
        const maps = await mapService.fetchAllMaps();
        
        completedSuccessfully(res)('All maps get successfully')(maps);
    } catch (error) {
        next(error);
    }
};

export const getMapById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const map = await mapService.fetchMapById(id);
        
        completedSuccessfully(res)('Map get successfully')(map);
    } catch (error) {
        next(error);
    }
};

export const updateMap = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedMap = await mapService.modifyMapById(id, updateData);
        
        completedSuccessfully(res)('Map updated successfully')(updatedMap);
    } catch (error) {
        next(error);
    }
};

export const deleteMap = async (req, res, next) => {
    try {
        const { id } = req.params;
        await mapService.removeMapById(id);
        
        deletedSuccessfully(res)('Map deleted successfully')();
    } catch (error) {
        next(error);
    }
};
