const validateMapConfiguration = async (req, res, next) => {
    try {
        const map = req.map;

        if (map.width <= 0 || map.height <= 0) {
            return res.status(400).json({ error: 'Dimensiones del mapa inválidas' });
        }

        if (!map.obstacles || map.obstacles.length === 0) {
            return res.status(400).json({ error: 'El mapa debe contener obstáculos' });
        }

        if (!map.waypoints || map.waypoints.length === 0) {
            return res.status(400).json({ error: 'El mapa debe contener puntos de parada' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default validateMapConfiguration;
