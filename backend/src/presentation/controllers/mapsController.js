import * as mapService from '../../application/services/mapService.js';

export const createMap = async (req, res, next) => {
    try {
        const { name, width, height, userId } = req.body;
        const newMap = await mapService.createNewMap({ name, width, height, userId });
        
        res.status(201).json({
            success: true,
            data: newMap
        });
    } catch (error) {
        next(error);
    }
};

export const getAllMaps = async (req, res, next) => {
    try {
        const maps = await mapService.fetchAllMaps();
        
        res.status(200).json({
            success: true,
            data: maps
        });
    } catch (error) {
        next(error);
    }
};

export const getMapById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const map = await mapService.fetchMapById(id);
        
        res.status(200).json({
            success: true,
            data: map
        });
    } catch (error) {
        next(error);
    }
};

export const updateMap = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedMap = await mapService.modifyMapById(id, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedMap
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMap = async (req, res, next) => {
    try {
        const { id } = req.params;
        await mapService.removeMapById(id);
        
        res.status(200).json({
            success: true,
            message: 'Map delete succesfully'
        });
    } catch (error) {
        next(error);
    }
};
