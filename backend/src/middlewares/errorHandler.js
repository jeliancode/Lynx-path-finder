import { logger } from '../infrastructure/logging/logger.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    logger.error({
        message: err.message,
        status: statusCode,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        stack: err.stack
    });

    res.status(statusCode).json({
        message: isProduction && statusCode === 500
            ? 'Internal server error'
            : err.message
    });
};