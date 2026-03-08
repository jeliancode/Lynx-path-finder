const customSuccess = (statusCode) => (res) => (message) => (data = {}) => {
  res.status(statusCode).json({
    message,
    data
  });
};

export const completedSuccessfully = customSuccess(200);
export const createdSuccessfully = customSuccess(201);
export const acceptedSuccessfully = customSuccess(202);
export const deletedSuccessfully = customSuccess(204);
