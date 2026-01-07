export const validateMapConfiguration = (map) => {
    if (map.width <= 0 || map.height <= 0) {
        throw new Error('Dimensiones del mapa inválidas');
    }

    if (!map.obstacles || map.obstacles.length === 0) {
        throw new Error('El mapa debe contener obstáculos');
    }

    if (!map.waypoints || map.waypoints.length === 0) {
        throw new Error('El mapa debe contener puntos de parada');
    }

    for (const obs of map.obstacles) {
        if (
            obs.x < 0 || obs.x >= map.width ||
            obs.y < 0 || obs.y >= map.height
        ) {
            throw new Error('Obstáculo fuera de los límites del mapa');
        }
    }
};
