const validateStartEndPoints = (req, res, next) => {
    try {
        const { startX, startY, endX, endY } = req.body;
        const map = req.map;

        const obstacleSet = new Set(map.obstacles.map(o => `${o.x},${o.y}`));

        if (obstacleSet.has(`${startX},${startY}`)) {
            return res.status(400).json({ error: 'El punto de inicio está bloqueado' });
        }

        if (obstacleSet.has(`${endX},${endY}`)) {
            return res.status(400).json({ error: 'El punto de destino está bloqueado' });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default validateStartEndPoints;
