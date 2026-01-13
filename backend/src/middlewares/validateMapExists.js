import { getMapById } from "../infrastructure/repositories/mapRepository.js";

const validateMapExists = async (req, res, next) => {
    try {    
    const { mapId } = req.body;

    if(!mapId) {
        return res.status(400).json({ error: 'Map ID is required' });
    }

    const map = await getMapById(mapId);

    if (!map) {
        return res.status(404).json({ error: 'Map not found' });
    }

    req.map = map;

    next();
    } catch (error) { 
        next(error);
    }
};

export default validateMapExists;
