const customError = (statusCode) => (errorMessage) => {
    const error = new Error(errorMessage);
    error.status = statusCode;
    return error;
};

export const badRequestError = customError(400);
export const unauthorizedError = customError(401);
export const accessDeniedError = customError(403);
export const notFoundError = customError(404);
export const conflictError = customError(409);
export const unprocessableEntity = customError(422);
export const serviceUnavailable = customError(503);
