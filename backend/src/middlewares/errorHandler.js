export const errorHandler = (err, req, res, next) => {
    const error = {
        code: err.status || 500,
        message: err.message || 'Internal server error'
    }

    res.status(error.code).json({ message: error.message });
}
