export const validateWaypointsReachable = (path, waypoints) => {
    const pathSet = new Set(path.map(p => `${p.x},${p.y}`));

    for (const wp of waypoints) {
        const key = `${wp.x},${wp.y}`;
        if (!pathSet.has(key)) {
            throw new Error(`La ruta no pasa por el punto de parada: ${wp.name}`);
        }
    }
};
