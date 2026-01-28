import validateWith from "./validator.js";

const asArray = (value) => Array.isArray(value) ? value : [value];

const isPointInsideMap = (map) => ({x, y}) =>
    x >= 0 &&
    x < map.width &&
    y >= 0 &&
    y < map.height;

const entitiesInsideMap =
    (map, getPoint, errorMessage) =>
        validateWith(
            (entities) =>
                asArray(entities).every(
                    (entity) => isPointInsideMap(map)(getPoint(entity))
                ),
                () => new Error(errorMessage)
        );

const obstaclePoint = ({ x, y }) => ({ x, y });

export const validateObstacleInsideMap = (map) =>
    entitiesInsideMap(
        map,
        obstaclePoint,
        "Obstacles outsite the map boundary"
    )

const waypointPoint = ({ x, y }) => ({ x, y });

export const validateWaypointsInsideMap = (map) =>
    entitiesInsideMap(
        map,
        waypointPoint,
        "Waypoints outsite the map boundary"
    );
