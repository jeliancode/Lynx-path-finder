import * as mapService from '../../application/services/mapService.js';

export const createMap = async (req, res) => {
    try {
        const { name, width, height, userId } = req.body;
        const newMap = await mapService.createNewMap({ name, width, height, userId });
        
        res.status(201).json({
            success: true,
            data: newMap
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllMaps = async (req, res) => {
    try {
        const maps = await mapService.fetchAllMaps();
        res.status(200).json({
            success: true,
            data: maps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMapById = async (req, res) => {
    try {
        const { id } = req.params;
        const map = await mapService.fetchMapById(id);
        
        res.status(200).json({
            success: true,
            data: map
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateMap = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedMap = await mapService.modifyMapById(id, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedMap
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteMap = async (req, res) => {
    try {
        const { id } = req.params;
        await mapService.removeMapById(id);
        
        res.status(200).json({
            success: true,
            message: 'Mapa eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
