export const validateStartEndPoints = (
    start,
    end,
    obstacles
) => {
    const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));

    if (obstacleSet.has(`${start.x},${start.y}`)) {
        throw new Error('El punto de inicio está bloqueado');
    }

    if (obstacleSet.has(`${end.x},${end.y}`)) {
        throw new Error('El punto de destino está bloqueado');
    }
};
